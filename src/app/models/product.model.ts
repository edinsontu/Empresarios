const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: String,
  emprendedorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Emprendedor',
    required: true
  }
});

module.exports = mongoose.model('Producto', productoSchema);
