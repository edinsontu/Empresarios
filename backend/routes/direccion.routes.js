const direccionController = require('../controllers/direccion.controller');
const express = require('express');
const router = express.Router();

router.post('/crearDireccion', direccionController.crearDireccion);
router.get('/getDirecciones/:clienteId', direccionController.getDireccionesCliente);

module.exports = router;