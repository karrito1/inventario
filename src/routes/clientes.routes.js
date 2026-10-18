import express from "express";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../controllers/clientes.controller.js";

const router = express.Router();

// 🔹 GET - listar clientes
router.get("/", getClientes);

// 🔹 POST - crear cliente
router.post("/", createCliente);

// 🔹 PUT - actualizar cliente
router.put("/:id", updateCliente);

// 🔹 DELETE - eliminar cliente
router.delete("/:id", deleteCliente);

export default router;