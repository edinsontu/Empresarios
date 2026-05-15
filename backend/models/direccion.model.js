const mongoose = require('mongoose');

const DireccionSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  pais: { type: String, default: 'Colombia' },
  departamento: { type: String, required: true },
  ciudad: { type: String, required: true },
  barrio: { type: String },
  direccion: { type: String, required: true }, 
  descripcion: String,
  esPredeterminada: { type: Boolean, default: false }
});

module.exports = mongoose.model('Direccion', DireccionSchema);