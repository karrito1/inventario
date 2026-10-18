import db from "../config/db.js";

export const getDashboard = async (req, res) => {
  try {
    const [[productos]] = await db.query(`
      SELECT COUNT(*) AS total FROM productos
    `);

    const [[bajoStock]] = await db.query(`
      SELECT COUNT(*) AS total 
      FROM productos 
      WHERE stock <= 5
    `);

    const [[ventas]] = await db.query(`
      SELECT COALESCE(SUM(total),0) AS total
      FROM ventas
      WHERE DATE(fecha) = CURDATE()
    `);

    const [movimientos] = await db.query(`
      SELECT 
        m.id,
        p.nombre AS producto,
        m.tipo,
        m.cantidad,
        m.fecha
      FROM movimientos_inventario m
      JOIN productos p ON m.producto_id = p.id
      ORDER BY m.id DESC
      LIMIT 10
    `);

    res.json({
      totalProductos: productos.total,
      bajoStock: bajoStock.total,
      ventasDelDia: ventas.total,
      movimientosRecientes: movimientos,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error dashboard",
      error: error.message,
    });
  }
};