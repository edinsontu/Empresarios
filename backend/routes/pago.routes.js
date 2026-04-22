const express = require('express');
const router = express.Router();

const pagoController = require('../controllers/pago.controller');

router.post('/confirmar-epayco', pagoController.confirmarPagoEpayco);
router.post('/verificar-estado', pagoController.verificarEstadoTrasPago);
router.get('/redireccion-final', pagoController.redireccionFinal);

module.exports = router;