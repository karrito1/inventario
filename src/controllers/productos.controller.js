import db from "../config/db.js";

// Obtener productos
export const getProductos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM productos");

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo productos",
      error: error.message,
    });
  }
};

// Crear producto
export const createProducto = async (req, res) => {
  try {
    const { nombre, categoria, precio, stock } = req.body;

    await db.query(
      "INSERT INTO productos (nombre,categoria, precio, stock) VALUES (?, ?, ?, ?)",
      [nombre, categoria, precio, stock],
    );

    res.status(201).json({
      message: "Producto creado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creando producto",
      error: error.message,
    });
  }
};

// Actualizar producto
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, precio, stock } = req.body;

    await db.query(
      "UPDATE productos SET nombre=?, categoria=?, precio=?, stock=? WHERE id=?",
      [nombre, categoria, precio, stock, id],
    );

    res.json({
      message: "Producto actualizado",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error actualizando producto",
      error: error.message,
    });
  }
};

// Eliminar producto
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM productos WHERE id=?", [id]);

    res.json({
      message: "Producto eliminado",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error eliminando producto",
      error: error.message,
    });
  }
};
