const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  tel: { type: String },
  password: { type: String, required: true }
});

module.exports = mongoose.model('Cliente', ClienteSchema);