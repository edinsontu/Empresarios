const mongoose = require("mongoose");

const EnvioSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente" },
  tipo: { type: String, enum: ["domicilio", "punto_recogida"], required: true },
  direccionId: { type: mongoose.Schema.Types.ObjectId, ref: "Direccion" },
  puntoRecogidaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PuntoRecogida",
  },
  empresaTransporte: { type: String, default: "Logística Interna" },
  fechaProgramada: { type: Date },
  estadoEnvio: {
    type: String,
    enum: ["alistamiento", "despachado", "en_ruta", "entregado"],
    default: "alistamiento",
  },
  zonaLogistica: String,
});

module.exports = mongoose.models.Envio || mongoose.model("Envio", EnvioSchema);
