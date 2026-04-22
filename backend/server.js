const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4200";
const allowedOrigins = frontendUrl.split(",").map((origin) => origin.trim());

// Configuración de middlewares
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/microempresarios")
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error de conexión:", err));

// Importar rutas
const clienteRoutes = require("./routes/cliente.routes");
const carritoComprasRoutes = require("./routes/carritoCompras.routes");
const emprendedorRoutes = require("./routes/emprendedor.routes");
const productoRoutes = require("./routes/producto.routes");
const loginRoutes = require("./routes/login.routes"); 
const ordenRoutes = require("./routes/orden.routes");
const pagoRoutes = require("./routes/pago.routes");

// Configuración de rutas
app.use("/api/clientes", clienteRoutes);
app.use("/api/carrito", carritoComprasRoutes); // Agrega esta línea para las rutas de carrito de compras
app.use("/api/emprendedores", emprendedorRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api", loginRoutes); 
app.use("/api/ordenes", ordenRoutes);
app.use("/api/pagos", pagoRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, service: "backend" });
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API de Microempresarios funcionando");
});

// Manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("¡Algo salió mal!");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
