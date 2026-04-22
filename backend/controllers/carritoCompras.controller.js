const CarritoCompras = require("../models/carritoCompras.model");
const Producto = require("../models/producto.model");
const Cliente = require("../models/cliente.model");

const recalcularTotales = async (carrito) => {
  let subtotal = 0;

  for (const item of carrito.productos) {
    const productoDoc = await Producto.findById(item.productoId);
    if (productoDoc) {
      subtotal += productoDoc.precio * item.cantidad;
    }
  }

  carrito.subtotal = subtotal;
  carrito.total = subtotal;
  return carrito;
};

const agregarAlCarrito = async (req, res) => {
  try {
    const { clienteId, productoId, cantidad } = req.body;

    const productoDoc = await Producto.findById(productoId);
    if (!productoDoc)
      return res.status(404).json({ message: "Producto no encontrado" });

    let carrito = await CarritoCompras.findOne({ clienteId });

    if (carrito) {
      const indexProducto = carrito.productos.findIndex(
        (p) => p.productoId.toString() === productoId,
      );
      if (indexProducto > -1) {
        carrito.productos[indexProducto].cantidad += cantidad;
      } else {
        carrito.productos.push({ productoId, cantidad });
      }
    } else {
      const cliente = await Cliente.findById(clienteId);
      carrito = new CarritoCompras({
        clienteId,
        email: cliente.email,
        productos: [{ productoId, cantidad }],
      });
    }

    // Recalcular antes de guardar
    carrito = await recalcularTotales(carrito);
    await carrito.save();
    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCarrito = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const carrito = await CarritoCompras.findOne({ clienteId }).populate(
      "productos.productoId",
    );

    if (!carrito)
      return res.status(404).json({ message: "Carrito vacío o no encontrado" });

    res.status(200).json(carrito);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const actualizarCantidad = async (req, res) => {
  try {
    const { clienteId, productoId, nuevaCantidad } = req.body;
    let carrito = await CarritoCompras.findOne({ clienteId });

    const item = carrito.productos.find(
      (p) => p.productoId.toString() === productoId,
    );
    if (item) {
      item.cantidad = nuevaCantidad;
      carrito = await recalcularTotales(carrito);
      await carrito.save();

      await carrito.populate("productos.productoId");

      res.status(200).json(carrito);
    } else {
      res.status(404).json({ message: "Producto no encontrado en el carrito" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarDelCarrito = async (req, res) => {
  try {
    const { clienteId, productoId } = req.body;
    let carrito = await CarritoCompras.findOne({ clienteId });

    if (!carrito)
      return res.status(404).json({ message: "Carrito no encontrado" });

    carrito.productos = carrito.productos.filter(
      (p) => p.productoId.toString() !== productoId,
    );

    carrito = await recalcularTotales(carrito);
    await carrito.save();

    // >>> NUEVAMENTE POPULAMOS AQUÍ <<<
    await carrito.populate("productos.productoId");

    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const vaciarCarrito = async (req, res) => {
  try {
    const { clienteId } = req.body;
    const carrito = await CarritoCompras.findOneAndDelete({ clienteId });
    res.status(200).json({ message: "Carrito vaciado", carrito: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  agregarAlCarrito,
  getCarrito,
  eliminarDelCarrito,
  actualizarCantidad,
  vaciarCarrito,
};
