const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');

// Rutas definitivas
router.post('/', productoController.agregarProducto); // POST /api/productos
router.get('/', productoController.obtenerTodosLosProductos); // GET /api/productos
router.get('/emprendedor/:emprendedorId', productoController.obtenerProductosPorEmprendedor); // GET /api/productos/emprendedor/:id
router.put('/:id', productoController.actualizarProducto); // PUT /api/productos/:id
router.delete('/:id', productoController.eliminarProducto); // DELETE /api/productos/:id

module.exports = router;