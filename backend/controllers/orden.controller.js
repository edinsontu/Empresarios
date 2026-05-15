const ordenModel = require("../models/orden.model");
const carritoComprasModel = require("../models/carritoCompras.model");
const clienteModel = require("../models/cliente.model");
const envioModel = require("../models/envio.model");
const { v4: uuid } = require("uuid");

const crearOrden = async (req, res) => {
  try {
    const { clienteId, envioId, costoEnvio } = req.body;

    const cliente = await clienteModel.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const envioCliente = await envioModel.findById(envioId);
    if (!envioCliente) {
      return res.status(404).json({ message: "Opción de envío no encontrada" });
    }

    const carrito = await carritoComprasModel
      .findOne({ clienteId })
      .populate("productos.productoId");
    if (!carrito || carrito.productos.length === 0) {
      return res
        .status(400)
        .json({ message: "El carrito de compras está vacío" });
    }
    const productos = carrito.productos.map((item) => ({
      productoId: item.productoId._id,
      nombre: item.productoId.nombre,
      precio: item.productoId.precio,
      cantidad: item.cantidad,
    }));

    const subtotal = productos.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0,
    );
    const total = subtotal + Number(costoEnvio || 0);

    const referenciaPago = `ORD-${Date.now()}-${uuid()}`;

    //Generar nueva orden
    const orden = new ordenModel({
      clienteId,
      envioId,
      productos,
      subtotal,
      total,
      referenciaPago,
      costoEnvio,
    });

    await orden.save();
    res
      .status(201)
      .json({ message: "Orden pendiente creada exitosamente", orden });
  } catch (error) {
    res.status(400).json({ message: "Error al crear la orden", error });
  }
};

const obtenerOrdenesPorCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const ordenes = await ordenModel
      .find({ clienteId })
      .populate("clienteId", "name email");
    res.status(200).json(ordenes);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al obtener las órdenes del cliente" });
  }
};

const actualizarEstadoOrden = async (req, res) => {
  try {
    const { ordenId } = req.params;
    const { estado } = req.body;
    if (
      !["pendiente", "completada", "rechazada", "expirada"].includes(estado)
    ) {
      return res.status(400).json({ message: "Estado no válido" });
    }
    const orden = await ordenModel.findByIdAndUpdate(
      ordenId,
      { estado },
      { new: true },
    );
    if (!orden) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    res.status(200).json({ message: "Estado de la orden actualizado", orden });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al actualizar el estado de la orden" });
  }
};

const reducirStock = async (productosVendidos) => {
  // productosVendidos es un array de { productoId, cantidad }
  const operaciones = productosVendidos.map(item => ({
    updateOne: {
      filter: { _id: item.productoId, cantidad: { $gte: item.cantidad } },
      update: { $inc: { cantidad: -item.cantidad } }
    }
  }));

  try {
    await Producto.bulkWrite(operaciones);
  } catch (error) {
    console.error("Error actualizando el inventario:", error);
  }
};

module.exports = {
  crearOrden,
  obtenerOrdenesPorCliente,
  actualizarEstadoOrden,
};
