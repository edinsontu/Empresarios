const envioControlller = require("../controllers/envio.controller");
const express = require("express");
const router = express.Router();

router.get("/cliente/:clienteId", envioControlller.getEnviosCliente);
router.post("/", envioControlller.crearRegistroEnvio);

module.exports = router;