const express = require("express");
const router = express.Router();
const ordenController = require("../controllers/orden.controller");

router.post("/crear", ordenController.crearOrden);
router.get("/cliente/:clienteId", ordenController.obtenerOrdenesPorCliente);
router.put("/actualizar-estado/:ordenId", ordenController.actualizarEstadoOrden);

module.exports = router;