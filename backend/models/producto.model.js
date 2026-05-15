const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String },
  imagen: { type: String },
  emprendedorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Emprendedor', required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Producto', productoSchema);
