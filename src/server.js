/*
=========================================================
ARCHIVO: server.js
=========================================================
*/

/* =====================================================
   CONFIGURACIÓN DE VARIABLES DE ENTORNO
   (Debe ir al inicio de todo)
===================================================== */
import "dotenv/config";

/* =====================================================
   IMPORTACIONES DE LA APLICACIÓN
===================================================== */
import app from "./app.js";

/* =====================================================
   CONFIGURACIÓN DEL PUERTO
===================================================== */
/*
Obtiene el puerto desde variables de entorno (Render asigna un puerto dinámico).
Si no existe, usa el puerto 4000 por defecto.
*/
const PORT = process.env.PORT || 4000;

/* =====================================================
   INICIALIZACIÓN DEL SERVIDOR
===================================================== */
app.listen(PORT, () => {
  console.log(`Backend corriendo en el puerto ${PORT}`);
});