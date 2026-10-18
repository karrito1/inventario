
/*
=========================================================
ARCHIVO: auth.controller.js
DESCRIPCIÓN:
- Registro de usuarios
- Inicio de sesión
- Generación de JWT
- Autenticación en dos pasos (2FA) desactivada temporalmente
=========================================================
*/

// =====================================================
// IMPORTACIÓN DE DEPENDENCIAS
// =====================================================

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

// =====================================================
// AUTENTICACIÓN 2FA DESACTIVADA TEMPORALMENTE
// Se conservan las importaciones originales.
// =====================================================

// import speakeasy from "speakeasy";
// import QRCode from "qrcode";

// =====================================================
// VARIABLES GLOBALES
// =====================================================

const JWT_SECRET = process.env.JWT_SECRET;

// =====================================================
// REGISTRO DE USUARIOS
// =====================================================

export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya existe
    const [exist] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (exist.length > 0) {
      return res.status(400).json({
        message: "Usuario ya existe",
      });
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(password, 10);

    // Guardar usuario
    await db.query(
      `
      INSERT INTO users
      (nombre, email, password)
      VALUES (?, ?, ?)
      `,
      [nombre, email, hash]
    );

    return res.json({
      message: "Usuario registrado",
    });
  } catch (error) {
    console.error("ERROR REGISTER:", error);

    return res.status(500).json({
      message: "Error register",
    });
  }
};

// =====================================================
// LOGIN DE USUARIO
// AUTENTICACIÓN SOLO CON CORREO Y CONTRASEÑA
// =====================================================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("EMAIL RECIBIDO:", email);

    // Buscar usuario
    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    // Validar existencia
    if (users.length === 0) {
      return res.status(400).json({
        message: "Usuario no existe",
      });
    }

    const user = users[0];

    // Validar contraseña
    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos",
      });
    }

    // =================================================
    // VALIDACIÓN 2FA DESACTIVADA TEMPORALMENTE
    // Código original conservado para referencia.
    // =================================================

    /*
    if (user.twofa_secret) {
      if (!codigo2FA) {
        return res.status(400).json({
          message: "Código 2FA requerido",
        });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twofa_secret,
        encoding: "base32",
        token: codigo2FA,
        window: 1,
      });

      if (!verified) {
        return res.status(400).json({
          message: "Código 2FA inválido",
        });
      }
    }
    */

    // =================================================
    // GENERACIÓN DE TOKEN JWT
    // =================================================

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Respuesta exitosa
    return res.json({
      token,
    });
  } catch (error) {
    console.error("ERROR LOGIN:", error);

    return res.status(500).json({
      message: "Error login",
    });
  }
};

// =====================================================
// GENERAR CONFIGURACIÓN 2FA
// DESACTIVADO TEMPORALMENTE
// =====================================================

/*
export const generate2FA = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: "InventarioApp",
    });

    const qr = await QRCode.toDataURL(secret.otpauth_url);

    return res.json({
      secret: secret.base32,
      qr,
    });
  } catch (error) {
    console.error("ERROR GENERATE 2FA:", error);

    return res.status(500).json({
      message: "Error generando configuración 2FA",
    });
  }
};
*/

// =====================================================
// GUARDAR CONFIGURACIÓN 2FA
// DESACTIVADO TEMPORALMENTE
// =====================================================

/*
export const save2FA = async (req, res) => {
  try {
    const { userId, secret } = req.body;

    await db.query(
      `
      UPDATE users
      SET twofa_secret = ?
      WHERE id = ?
      `,
      [secret, userId]
    );

    return res.json({
      message: "2FA activado",
    });
  } catch (error) {
    console.error("ERROR SAVE 2FA:", error);

    return res.status(500).json({
      message: "Error guardando configuración 2FA",
    });
  }
};
*/
