const mongoose = require("mongoose");

const carritoComprasSchema = new mongoose.Schema(
  {
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },
    productos: [
      {
        productoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
          required: true,
        },
        cantidad: { type: Number, required: true, min: 1 },
      },
    ],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("CarritoCompras", carritoComprasSchema);
