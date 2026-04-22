const Emprendedor = require('../models/emprendedor.model');
const bcrypt = require('bcryptjs');

const registrarEmprendedor = async (req, res) => {
  try {
    const { name, nameEmprendimiento, email, tel, password } = req.body;

    // Validaciones básicas
    if (!name || !nameEmprendimiento || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben estar llenos' });
    }

    // Verificar si ya existe un emprendedor con ese correo
    const emprendedorExistente = await Emprendedor.findOne({ email });
    if (emprendedorExistente) {
      return res.status(400).json({ message: 'Ya existe un emprendedor con ese correo' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo emprendedor
    const nuevoEmprendedor = new Emprendedor({
      name,
      nameEmprendimiento,
      email,
      tel,
      password: hashedPassword,
    });

    await nuevoEmprendedor.save();
    res.status(201).json({ message: 'Emprendedor registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar emprendedor:', error);
    res.status(500).json({
      message: 'Error interno al registrar emprendedor',
      error: error.message,
    });
  }
};

module.exports = { registrarEmprendedor };
