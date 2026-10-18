/*
=========================================================
ARCHIVO: auth.routes.js
DESCRIPCIÓN:
Definición de rutas relacionadas con autenticación,
seguridad y doble factor de autenticación (2FA).

ARQUITECTURA:
- Routes  -> Definen endpoints
- Controllers -> Contienen lógica de negocio
- Database -> Persistencia de datos
- Middleware -> Seguridad y validaciones

OBJETIVO:
Mantener una estructura modular y escalable
para futuras funcionalidades como:

- Recuperación de contraseña
- Verificación por correo
- OAuth (Google, GitHub)
- Refresh Tokens
- Roles y permisos
- Middleware JWT
=========================================================
*/

/* =====================================================
   IMPORTACIONES
===================================================== */

// Framework principal
import express from "express";

/*
Controladores de autenticación.

Cada función tiene una responsabilidad específica,
permitiendo desacoplar la lógica de las rutas.
*/
import {
  register,      // Registro de nuevos usuarios
  login,         // Inicio de sesión
  generate2FA,  // Generación de QR para 2FA
  save2FA,      // Persistencia del secret 2FA
} from "../controllers/auth.controller.js";

/* =====================================================
   INICIALIZACIÓN DEL ROUTER
===================================================== */

/*
Express Router permite dividir el sistema
en módulos independientes.

Ventajas:
- Código organizado
- Fácil mantenimiento
- Escalabilidad
- Separación de responsabilidades
*/
const router = express.Router();

/* =====================================================
   RUTAS DE AUTENTICACIÓN
===================================================== */

/*
---------------------------------------------------------
REGISTRO DE USUARIO
---------------------------------------------------------

ENDPOINT:
POST /api/auth/register

DESCRIPCIÓN:
Crea un nuevo usuario en el sistema.

BODY:
{
  "nombre": "Cristian",
  "email": "correo@gmail.com",
  "password": "123456"
}

FLUJO:
1. Validar datos
2. Verificar usuario existente
3. Encriptar contraseña
4. Guardar usuario
5. Responder al cliente
*/
router.post("/register", register);

/*
---------------------------------------------------------
LOGIN DE USUARIO
---------------------------------------------------------

ENDPOINT:
POST /api/auth/login

DESCRIPCIÓN:
Autentica un usuario y genera un token JWT.

BODY:
{
  "email": "correo@gmail.com",
  "password": "123456",
  "codigo2FA": "123456"
}

FLUJO:
1. Buscar usuario
2. Comparar contraseña
3. Validar 2FA (si existe)
4. Generar JWT
5. Retornar token
*/
router.post("/login", login);

/*
---------------------------------------------------------
GENERAR QR PARA 2FA
---------------------------------------------------------

ENDPOINT:
GET /api/auth/2fa/generate

DESCRIPCIÓN:
Genera un código QR compatible con Google Authenticator
u otras aplicaciones TOTP.

RESPUESTA:
{
  "secret": "BASE32_SECRET",
  "qr": "data:image/png;base64,..."
}

OBJETIVO:
Permitir al usuario activar autenticación
en dos pasos.
*/
router.get("/2fa/generate", generate2FA);

/*
---------------------------------------------------------
GUARDAR CONFIGURACIÓN 2FA
---------------------------------------------------------

ENDPOINT:
POST /api/auth/2fa/save

DESCRIPCIÓN:
Guarda el secret 2FA asociado al usuario.

BODY:
{
  "userId": 1,
  "secret": "BASE32_SECRET"
}

OBJETIVO:
Persistir la configuración de autenticación
de doble factor.
*/
router.post("/2fa/save", save2FA);

/* =====================================================
   EXPORTACIÓN DEL ROUTER
===================================================== */

/*
El router se exporta para ser utilizado
en el archivo principal del servidor.

Ejemplo:
app.use("/api/auth", authRoutes);
*/
export default router;