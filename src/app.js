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

/* =====================================================
   MIDDLEWARES GLOBALES
===================================================== */

const allowedOrigins = [
  "http://localhost:5173",
  "https://inventario-fronweb.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite peticiones sin origin (como Postman o Server-to-Server)
      if (!origin) return callback(null, true);

      // Permite el dominio principal, el de producción o CUALQUIER subdominio de vercel.app de tu proyecto
      const isAllowed = allowedOrigins.includes(origin) || origin.endsWith(".vercel.app");

      if (isAllowed) {
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
