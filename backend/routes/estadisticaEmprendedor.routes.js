const estadisticaEmprendedorController = require('../controllers/estadisticaEmprendedor.controller');
const express = require('express');
const router = express.Router();

router.get('/estadisticas/:id', estadisticaEmprendedorController.getEstadisticasEmprendedor);
router.get('/pedidos-pendientes/:id', estadisticaEmprendedorController.getPedidosPendientes);

module.exports = router;