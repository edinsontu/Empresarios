const Cliente = require('../models/cliente.model');
const bcrypt = require('bcryptjs');

const registrarCliente = async (req, res) => {
  try {
    const { name, email, tel, password } = req.body;
    const emailNormalizado = email?.trim().toLowerCase();

    if (!name?.trim() || !emailNormalizado || !password) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben estar llenos' });
    }

    // Verificar si ya existe un cliente con ese correo
    const clienteExistente = await Cliente.findOne({ email: emailNormalizado });
    if (clienteExistente) {
      return res.status(400).json({ message: 'Ya existe un cliente con ese correo' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear cliente con contraseña encriptada
    const nuevoCliente = new Cliente({
      name: name.trim(),
      email: emailNormalizado,
      tel,
      password: hashedPassword,
    });

    await nuevoCliente.save();
    res.status(201).json({ message: 'Cliente registrado exitosamente' });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ message: 'Ya existe un cliente con ese correo' });
    }

    console.error('Error al registrar cliente:', error);
    res.status(500).json({
      message: 'Error interno al registrar cliente',
      error: error.message,
    });
  }
};

module.exports = { registrarCliente };
