import db from "../config/db.js";

// 🔹 GET movimientos de inventario
export const getInventario = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        m.id,
        p.nombre AS producto,
        m.tipo,
        m.cantidad,
        m.fecha,
        m.observaciones
      FROM movimientos_inventario m
      JOIN productos p ON m.producto_id = p.id
      ORDER BY m.id DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo inventario",
      error: error.message,
    });
  }
};

// 🔹 CREATE movimiento
export const createMovimiento = async (req, res) => {
  try {
    const { producto, tipo, cantidad, observaciones } = req.body;

    // 1. Insertar movimiento
    await db.query(
      "INSERT INTO movimientos_inventario (producto_id, tipo, cantidad, observaciones) VALUES (?, ?, ?, ?)",
      [producto, tipo, cantidad, observaciones]
    );

    // 2. ACTUALIZAR STOCK AUTOMÁTICO
    if (tipo === "entrada") {
      await db.query(
        "UPDATE productos SET stock = stock + ? WHERE id = ?",
        [cantidad, producto]
      );
    } else if (tipo === "salida") {
      await db.query(
        "UPDATE productos SET stock = stock - ? WHERE id = ?",
        [cantidad, producto]
      );
    }

    res.status(201).json({
      message: "Movimiento registrado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registrando movimiento",
      error: error.message,
    });
  }
};