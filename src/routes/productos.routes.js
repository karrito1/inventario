import express from "express";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../controllers/productos.controller.js";

const router = express.Router();

// Obtener productos
router.get("/", getProductos);

// Crear producto
router.post("/", createProducto);

// Actualizar producto
router.put("/:id", updateProducto);

// Eliminar producto
router.delete("/:id", deleteProducto);

export default router;
