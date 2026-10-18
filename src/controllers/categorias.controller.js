import db from "../config/db.js";

// GET
export const getCategorias = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categorias");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST
export const createCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;

    const [result] = await db.query(
      "INSERT INTO categorias (nombre) VALUES (?)",
      [nombre],
    );

    res.json({
      id: result.insertId,
      nombre,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT
export const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    await db.query("UPDATE categorias SET nombre = ? WHERE id = ?", [
      nombre,
      id,
    ]);

    res.json({ message: "Categoría actualizada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM categorias WHERE id = ?", [id]);

    res.json({ message: "Categoría eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
