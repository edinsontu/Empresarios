const envioModel = require("../models/Envio.model");

const crearRegistroEnvio = async (req, res) => {
  try {
    const { clienteId, tipo, direccionId, puntoRecogidaId } = req.body;

    const nuevoEnvio = new envioModel({
      clienteId,
      tipo,
      direccionId: tipo === "domicilio" ? direccionId : null,
      puntoRecogidaId: tipo === "punto_recogida" ? puntoRecogidaId : null,
      fechaProgramada: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 
    });

    await nuevoEnvio.save();
    res.status(201).json(nuevoEnvio);
  } catch (error) {
    res.status(400).send("Error al procesar logística");
  }
};

const getEnviosCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const envios = await envioModel.find({ clienteId });
    res.status(201).json(envios);
  } catch (error) {
    res.status(400).send("Error al obtener envíos del cliente");
  }
};

module.exports = {
  crearRegistroEnvio,
  getEnviosCliente,
};
