const Orden = require("../models/orden.model");
const mongoose = require("mongoose");

const getEstadisticasEmprendedor = async (req, res) => {
  try {
    const emprendedorId = new mongoose.Types.ObjectId(req.params.id);

    const stats = await Orden.aggregate([
      { $match: { estado: "completada" } },

      { $unwind: "$productos" },

      {
        $lookup: {
          from: "productos",
          localField: "productos.productoId",
          foreignField: "_id",
          as: "detalleProducto",
        },
      },
      { $unwind: "$detalleProducto" },

      { $match: { "detalleProducto.emprendedorId": emprendedorId } },

      {
        $group: {
          _id: emprendedorId,
          totalVendido: {
            $sum: { $multiply: ["$productos.precio", "$productos.cantidad"] },
          },
          cantidadPedidos: { $addToSet: "$_id" },
          productosVendidos: { $sum: "$productos.cantidad" },
          clientesUnicos: { $addToSet: "$clienteId" },
          rankingProductos: {
            $push: {
              nombre: "$productos.nombre",
              cantidad: "$productos.cantidad",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalVendido: 1,
          totalPedidos: { $size: "$cantidadPedidos" },
          totalClientes: { $size: "$clientesUnicos" },
          productosVendidos: 1,
          rankingProductos: 1,
        },
      },
    ]);

    res.json(
      stats[0] || {
        totalVendido: 0,
        totalPedidos: 0,
        totalClientes: 0,
        productosVendidos: 0,
      },
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPedidosPendientes = async (req, res) => {
  try {
    const emprendedorId = new mongoose.Types.ObjectId(req.params.id);

    const misProductosIds = await Producto.find({ emprendedorId }).distinct(
      "_id",
    );

    const pedidos = await Orden.find({
      estado: "pendiente",
      "productos.productoId": { $in: misProductosIds },
    })
      .populate("clienteId", "name email tel")
      .sort({ fecha: -1 });

    const respuesta = pedidos.map((orden) => {
      const ordenObj = orden.toObject();
      ordenObj.misProductos = ordenObj.productos.filter((p) =>
        misProductosIds.some((myId) => myId.equals(p.productoId)),
      );

      ordenObj.miSubtotal = ordenObj.misProductos.reduce(
        (acc, p) => acc + p.precio * p.cantidad,
        0,
      );
      return ordenObj;
    });

    res.json(respuesta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEstadisticasEmprendedor,
  getPedidosPendientes,
};
