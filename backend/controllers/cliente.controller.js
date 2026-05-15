const Cliente = require('../models/cliente.model');
const bcrypt = require('bcryptjs');

const registrarCliente = async (req, res) => {
  try {
    const { name, email, tel, password } = req.body;

    // Verificar si ya existe un cliente con ese correo
    const clienteExistente = await Cliente.findOne({ email });
    if (clienteExistente) {
      return res.status(400).json({ message: 'Ya existe un cliente con ese correo' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear cliente con contraseña encriptada
    const nuevoCliente = new Cliente({
      name,
      email,
      tel,
      password: hashedPassword,
    });

    await nuevoCliente.save();
    res.status(201).json({ message: 'Cliente registrado exitosamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { registrarCliente };
