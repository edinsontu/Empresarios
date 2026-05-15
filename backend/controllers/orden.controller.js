const ordenModel = require("../models/orden.model");
const carritoComprasModel = require("../models/carritoCompras.model");
const clienteModel = require("../models/cliente.model");
const {v4: uuid} = require("uuid");

const crearOrden = async (req, res) => {
  try {
    const { clienteId } = req.body;

    const cliente = await clienteModel.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
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
    const total = subtotal;
    
    const referenciaPago = `ORD-${Date.now()}-${uuid()}`;

    //Generar nueva orden
    const orden = new ordenModel({
      clienteId,
      productos,
      subtotal,
      total,
      referenciaPago,
    });

    await orden.save();
    res
      .status(201)
      .json({ message: "Orden pendiente creada exitosamente", orden });
  } catch (error) {
    res.status(400).json({ message: "Error al crear la orden" });
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

module.exports = {
  crearOrden,
  obtenerOrdenesPorCliente,
  actualizarEstadoOrden,
};
