import express from "express";
import {
  getInventario,
  createMovimiento,
} from "../controllers/inventario.controller.js";

const router = express.Router();

// 🔹 GET historial inventario
router.get("/", getInventario);

// 🔹 POST nuevo movimiento
router.post("/", createMovimiento);

export default router;