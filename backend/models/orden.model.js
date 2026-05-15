const mongoose = require('mongoose');

const OrdenSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  productos: [{
    productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    nombre: String, 
    precio: Number, 
    cantidad: Number
  }],
  subtotal: Number,
  total: Number,
  estado: { 
    type: String, 
    enum: ['pendiente', 'completada', 'rechazada', 'expirada'], 
    default: 'pendiente' 
  },
  referenciaPago: { type: String, unique: true }, 
  epaycoTransactionId: { type: String },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Orden', OrdenSchema);