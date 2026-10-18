/*
=========================================================
ARCHIVO: app.js
=========================================================
*/

import express from "express";
import cors from "cors";

// Rutas
import authRoutes from "./routes/auth.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import inventarioRoutes from "./routes/inventario.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";

const app = express();

/* =====================================================
   MIDDLEWARES GLOBALES
===================================================== */

/*
Configuración de CORS para aceptar peticiones tanto locales
como de tu frontend desplegado en producción (Vercel).
*/
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL // Ej: https://mi-frontend.vercel.app
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite peticiones sin origin (como Postman o Server-to-Server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Acceso no permitido por política de CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

/* =====================================================
   REGISTRO DE RUTAS
===================================================== */

app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/ventas", ventasRoutes);

/* =====================================================
   EXPORTACIÓN DE LA APLICACIÓN
===================================================== */

export default app;
