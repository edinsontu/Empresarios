const Producto = require('../models/producto.model');

const obtenerTodosLosProductos = async (req, res) => {
  try {
    const productos = await Producto.find().populate('emprendedorId', 'name tel nameEmprendimiento');
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos', error });
  }
};

const agregarProducto = async (req, res) => {
  try {
    const { nombre, precio, descripcion, imagen, emprendedorId } = req.body;

    const nuevoProducto = new Producto({ nombre, precio, descripcion, imagen, emprendedorId });
    await nuevoProducto.save();

    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const obtenerProductosPorEmprendedor = async (req, res) => {
  try {
    const { emprendedorId } = req.params;
    const productos = await Producto.find({ emprendedorId });
    console.log('Productos encontrados:', productos); // 👈 Para depuración
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await Producto.findByIdAndDelete(id);
    res.status(200).json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const productoActualizado = await Producto.findByIdAndUpdate(id, req.body, { new: true });
    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  agregarProducto,
  obtenerProductosPorEmprendedor,
  eliminarProducto,
  actualizarProducto,
  obtenerTodosLosProductos
};
