const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');

router.post('/register', clienteController.registrarCliente); 
module.exports = router;
