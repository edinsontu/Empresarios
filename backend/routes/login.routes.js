const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Cliente = require('../models/cliente.model');
const Emprendedor = require('../models/emprendedor.model');

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar primero por email en clientes
    const cliente = await Cliente.findOne({ email });
    if (cliente && await bcrypt.compare(password, cliente.password)) {
      return res.json({
        usuario: {
          _id: cliente._id,
          name: cliente.name,
          email: cliente.email,
          tipo: 'cliente'
        }
      });
    }

    // Buscar en emprendedores si no es cliente
    const emprendedor = await Emprendedor.findOne({ email });
    if (emprendedor && await bcrypt.compare(password, emprendedor.password)) {
      return res.json({
        usuario: {
          _id: emprendedor._id,
          name: emprendedor.name,
          email: emprendedor.email,
          tipo: 'emprendedor'
        }
      });
    }

    // Si no encuentra ninguno
    res.status(401).json({ error: 'Credenciales incorrectas' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
