const express = require('express');
const { registrarEmprendedor } = require('../controllers/emprendedor.controller');

const router = express.Router();
router.post('/register', registrarEmprendedor);

module.exports = router;