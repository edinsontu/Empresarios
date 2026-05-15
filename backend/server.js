const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Configuración de middlewares
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:4200";
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/microempresarios",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
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
const direccionRoutes = require("./routes/direccion.routes");
const envioRoutes = require("./routes/envio.routes");
const estadisticaEmprendedorRoutes = require("./routes/estadisticaEmprendedor.routes");

// Configuración de rutas
app.use("/api/clientes", clienteRoutes);
app.use("/api/carrito", carritoComprasRoutes);
app.use("/api/emprendedores", emprendedorRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api", loginRoutes); 
app.use("/api/ordenes", ordenRoutes);
app.use("/api/pagos", pagoRoutes);
app.use("/api/direcciones", direccionRoutes); 
app.use("/api/envios", envioRoutes);
app.use("/api/estadisticasEmprendedor", estadisticaEmprendedorRoutes);

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
