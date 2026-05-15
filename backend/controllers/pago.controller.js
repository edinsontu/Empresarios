const ordenModel = require("../models/orden.model");
const carritoComprasModel = require("../models/carritoCompras.model");
const crypto = require("crypto");

const confirmarPagoEpayco = async (req, res) => {
  try {
    const data = req.body;
    console.log("Validando transacción:", data.x_id_invoice);

    const signatureCheck = crypto
      .createHash("sha256")
      .update(
        `${process.env.EPAYCO_CUSTOMER_ID}^${process.env.EPAYCO_P_KEY}^${data.x_ref_payco}^${data.x_transaction_id}^${data.x_amount}^${data.x_currency_code}`,
      )
      .digest("hex");

    if (signatureCheck !== data.x_signature) {
      console.error("Firma inválida. Posible intento de fraude.");
      return res.status(400).send("Firma inválida");
    }

    const orden = await ordenModel.findOne({
      referenciaPago: data.x_id_invoice,
    });

    if (!orden) {
      console.error("Orden no encontrada en DB:", data.x_id_invoice);
      return res.status(404).send("Orden no encontrada");
    }

    const codRespuesta = parseInt(data.x_cod_response);

    if (codRespuesta === 1) {
      orden.estado = "completada";
      orden.epaycoTransactionId = data.x_transaction_id;

      await carritoComprasModel.findOneAndDelete({
        clienteId: orden.clienteId,
      });
      console.log("Pago aceptado. Orden completada y carrito limpio.");
    } else if ([2, 4, 10].includes(codRespuesta)) {
      orden.estado = "rechazada";
      console.log("Pago rechazado/fallido.");
    }

    await orden.save();

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error crítico en Webhook:", error);
    res.status(500).send("Error interno");
  }
};

const verificarEstadoTrasPago = async (req, res) => {
  try {
    const { ref_payco } = req.body;

    const data = result.data;

    const codigoRespuesta = parseInt(data.x_cod_response);

    if (codigoRespuesta === 1) {
      return res.json({ status: "completada", orden });
    }

    res.json({ status: orden.estado });
  } catch (error) {
    res.status(500).send("Error de servidor");
  }
};

const redireccionFinal = (req, res) => {
  const queryParams = new URLSearchParams(req.query).toString();
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4200";

  res.redirect(`${frontendUrl}/pago-finalizado?${queryParams}`);
};

module.exports = {
  confirmarPagoEpayco,
  verificarEstadoTrasPago,
  redireccionFinal,
};
