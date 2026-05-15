const direccionModel = require("../models/direccion.model");

const getDireccionesCliente = async (req, res) => {
  try {
    const direcciones = await direccionModel.find({ clienteId: req.params.clienteId });
    res.json(direcciones);
  } catch (error) {
    res.status(500).send("Error al obtener direcciones");
  }
};

const crearDireccion = async (req, res) => {
  try {
    const nuevaDireccion = new direccionModel(req.body);
    await nuevaDireccion.save();
    res.status(201).json(nuevaDireccion);
  } catch (error) {
    res.status(400).send("Error al crear dirección");
  }
};

module.exports = { getDireccionesCliente, crearDireccion };