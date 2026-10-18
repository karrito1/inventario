
/*
=========================================================
ARCHIVO: auth.routes.js

DESCRIPCIÓN:
Rutas de autenticación.
2FA DESACTIVADO TEMPORALMENTE.
=========================================================
*/

// =====================================================
// IMPORTACIONES
// =====================================================

import express from "express";

import {
  register,
  login,

  // 2FA DESACTIVADO TEMPORALMENTE
  // generate2FA,
  // save2FA,

} from "../controllers/auth.controller.js";

// =====================================================
// INICIALIZACIÓN DEL ROUTER
// =====================================================

const router = express.Router();

// =====================================================
// REGISTRO DE USUARIO
// =====================================================

router.post("/register", register);

// =====================================================
// LOGIN SIN GOOGLE AUTHENTICATOR
// Solo correo y contraseña
// =====================================================

router.post("/login", login);

// =====================================================
// RUTAS 2FA DESACTIVADAS TEMPORALMENTE
// Se conservan comentadas para uso futuro.
// =====================================================

/*
// Generar QR para Google Authenticator
router.get("/2fa/generate", generate2FA);

// Guardar configuración 2FA
router.post("/2fa/save", save2FA);
*/

// =====================================================
// EXPORTACIÓN DEL ROUTER
// =====================================================

export default router;
