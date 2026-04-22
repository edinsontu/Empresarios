const express = require("express");
const router = express.Router();
const carritoComprasController = require("../controllers/carritoCompras.controller");

router.post("/agregar", carritoComprasController.agregarAlCarrito);
router.get("/:clienteId", carritoComprasController.getCarrito);
router.post("/eliminar", carritoComprasController.eliminarDelCarrito);
router.delete("/vaciar", carritoComprasController.vaciarCarrito);
router.put("/actualizar", carritoComprasController.actualizarCantidad);

module.exports = router;