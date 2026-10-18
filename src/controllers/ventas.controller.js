import db from "../config/db.js";

// 🔹 GET ventas
export const getVentas = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        v.id,
        c.nombre AS cliente,
        v.total,
        v.fecha
      FROM ventas v
      JOIN clientes c ON v.cliente_id = c.id
      ORDER BY v.id DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo ventas",
      error: error.message,
    });
  }
};

// 🔹 CREATE venta (CON ITEMS)
export const createVenta = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { cliente, items, total } = req.body;

    // 1. insertar venta
    const [venta] = await connection.query(
      "INSERT INTO ventas (cliente_id, total) VALUES (?, ?)",
      [cliente, total]
    );

    const ventaId = venta.insertId;

    // 2. insertar detalles
    for (const item of items) {
      await connection.query(
        "INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio, subtotal) VALUES (?, ?, ?, ?, ?)",
        [
          ventaId,
          item.producto,
          item.cantidad,
          item.precio,
          item.subtotal,
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Venta registrada correctamente",
      ventaId,
    });
  } catch (error) {
    await connection.rollback();

    res.status(500).json({
      message: "Error creando venta",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};