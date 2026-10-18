/*
=========================================================
ARCHIVO: auth.controller.js
DESCRIPCIÓN:
Controlador encargado de gestionar:

- Registro de usuarios
- Inicio de sesión
- Generación de JWT
- Autenticación en dos pasos (2FA)
- Generación de códigos QR

ARQUITECTURA ESCALABLE:
Este controlador sigue una arquitectura modular
basada en responsabilidades separadas:

/routes        -> Endpoints
/controllers   -> Lógica de negocio
/services      -> Procesos reutilizables
/config        -> Configuración global
/middlewares   -> Seguridad y validaciones
/database      -> Persistencia de datos

OBJETIVO:
Permitir crecimiento del sistema sin afectar
la mantenibilidad del código.
=========================================================
*/

/* =====================================================
   IMPORTACIÓN DE DEPENDENCIAS
===================================================== */

/*
bcrypt:
Permite encriptar contraseñas y compararlas
de forma segura.
*/
import bcrypt from "bcrypt";

/*
jsonwebtoken:
Permite generar tokens JWT para autenticación.
*/
import jwt from "jsonwebtoken";

/*
Conexión centralizada a MySQL.
*/
import { db } from "../config/db.js";

/*
speakeasy:
Librería para autenticación TOTP (2FA).
Compatible con Google Authenticator.
*/
import speakeasy from "speakeasy";

/*
QRCode:
Generador de códigos QR para activar 2FA.
*/
import QRCode from "qrcode";

/* =====================================================
   VARIABLES GLOBALES
===================================================== */

/*
Clave secreta usada para firmar tokens JWT.

Se recomienda almacenar variables sensibles
en archivos .env
*/
const JWT_SECRET = process.env.JWT_SECRET;

/* =====================================================
   REGISTRO DE USUARIOS
===================================================== */

/*
FUNCIÓN:
register()

OBJETIVO:
Registrar nuevos usuarios en el sistema.

ENDPOINT:
POST /api/auth/register

BODY:
{
  "nombre": "Cristian",
  "email": "correo@gmail.com",
  "password": "123456"
}

FLUJO:
1. Obtener datos
2. Verificar existencia
3. Encriptar contraseña
4. Guardar usuario
5. Responder al cliente
*/
export const register = async (req, res) => {
  try {
    /* ================================================
       OBTENER DATOS DEL CLIENTE
    ================================================ */
    const { nombre, email, password } = req.body;

    /* ================================================
       VALIDAR SI EL USUARIO YA EXISTE
    ================================================ */
    const [exist] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    /*
    Si existe al menos un usuario con ese correo,
    se bloquea el registro.
    */
    if (exist.length > 0) {
      return res.status(400).json({
        message: "Usuario ya existe",
      });
    }

    /* ================================================
       ENCRIPTAR CONTRASEÑA
    ================================================ */

    /*
    Salt rounds = 10
    Aumenta seguridad contra ataques rainbow table.
    */
    const hash = await bcrypt.hash(password, 10);

    /* ================================================
       INSERTAR USUARIO EN BASE DE DATOS
    ================================================ */
    await db.query(
      `
      INSERT INTO users
      (nombre, email, password)
      VALUES (?, ?, ?)
      `,
      [nombre, email, hash],
    );

    /* ================================================
       RESPUESTA EXITOSA
    ================================================ */
    res.json({
      message: "Usuario registrado",
    });
  } catch (error) {
    /* ================================================
       MANEJO DE ERRORES
    ================================================ */

    console.error("ERROR REGISTER:", error);

    res.status(500).json({
      message: "Error register",
    });
  }
};

/* =====================================================
   LOGIN DE USUARIO
===================================================== */

/*
FUNCIÓN:
login()

OBJETIVO:
Autenticar usuarios y generar JWT.

ENDPOINT:
POST /api/auth/login

BODY:
{
  "email": "correo@gmail.com",
  "password": "123456",
  "codigo2FA": "123456"
}

FLUJO:
1. Buscar usuario
2. Validar contraseña
3. Validar 2FA
4. Generar token JWT
5. Retornar token
*/
export const login = async (req, res) => {
  try {
    /* ================================================
       OBTENER DATOS DEL CLIENTE
    ================================================ */
    const { email, password, codigo2FA } = req.body;

    console.log("EMAIL RECIBIDO:", email);

    /* ================================================
       BUSCAR USUARIO
    ================================================ */
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    /* ================================================
       VALIDAR EXISTENCIA DEL USUARIO
    ================================================ */
    if (users.length === 0) {
      return res.status(400).json({
        message: "Usuario no existe",
      });
    }

    /*
    Se obtiene el primer usuario encontrado.
    */
    const user = users[0];

    /* ================================================
       VALIDAR CONTRASEÑA
    ================================================ */

    /*
    bcrypt.compare:
    Compara contraseña ingresada con hash almacenado.
    */
    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos",
      });
    }

    /* ================================================
       VALIDACIÓN DE DOBLE FACTOR (2FA)
    ================================================ */

    /*
    Si el usuario tiene activado 2FA,
    se exige código temporal.
    */
    if (user.twofa_secret) {
      /*
      Validar existencia del código.
      */
      if (!codigo2FA) {
        return res.status(400).json({
          message: "Código 2FA requerido",
        });
      }

      /*
      Verificar token TOTP.
      */
      const verified = speakeasy.totp.verify({
        secret: user.twofa_secret,
        encoding: "base32",
        token: codigo2FA,
        window: 1,
      });

      /*
      Código inválido.
      */
      if (!verified) {
        return res.status(400).json({
          message: "Código 2FA inválido",
        });
      }
    }

    /* ================================================
       GENERACIÓN DE TOKEN JWT
    ================================================ */

    /*
    jwt.sign:
    Genera token firmado digitalmente.
    */
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    /* ================================================
       RESPUESTA EXITOSA
    ================================================ */
    res.json({
      token,
    });
  } catch (error) {
    /* ================================================
       MANEJO DE ERRORES
    ================================================ */

    console.error("ERROR LOGIN:", error);

    res.status(500).json({
      message: "Error login",
    });
  }
};

/* =====================================================
   GENERAR CONFIGURACIÓN 2FA
===================================================== */

/*
FUNCIÓN:
generate2FA()

OBJETIVO:
Generar secret y código QR para activar
autenticación en dos pasos.

ENDPOINT:
GET /api/auth/2fa/generate
*/
export const generate2FA = async (req, res) => {
  /* ================================================
     GENERAR SECRET
  ================================================ */

  /*
  Secret único compatible con Google Authenticator.
  */
  const secret = speakeasy.generateSecret({
    name: "InventarioApp",
  });

  /* ================================================
     GENERAR QR
  ================================================ */

  /*
  QR en formato base64.
  */
  const qr = await QRCode.toDataURL(secret.otpauth_url);

  /* ================================================
     RESPUESTA
  ================================================ */
  res.json({
    secret: secret.base32,
    qr,
  });
};

/* =====================================================
   GUARDAR CONFIGURACIÓN 2FA
===================================================== */

/*
FUNCIÓN:
save2FA()

OBJETIVO:
Guardar secret 2FA del usuario.

ENDPOINT:
POST /api/auth/2fa/save

BODY:
{
  "userId": 1,
  "secret": "BASE32_SECRET"
}
*/
export const save2FA = async (req, res) => {
  /* ================================================
     OBTENER DATOS
  ================================================ */
  const { userId, secret } = req.body;

  /* ================================================
     ACTUALIZAR USUARIO
  ================================================ */
  await db.query(
    `
    UPDATE users
    SET twofa_secret = ?
    WHERE id = ?
    `,
    [secret, userId],
  );

  /* ================================================
     RESPUESTA EXITOSA
  ================================================ */
  res.json({
    message: "2FA activado",
  });
};
