import express from "express";
import { getVentas, createVenta } from "../controllers/ventas.controller.js";

const router = express.Router();

router.get("/", getVentas);
router.post("/", createVenta);

export default router;