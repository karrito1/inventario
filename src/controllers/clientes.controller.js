import db from "../config/db.js";

//  Obtener clientes
export const getClientes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM clientes");
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo clientes",
      error: error.message,
    });
  }
};

//  Crear cliente
export const createCliente = async (req, res) => {
  try {
    const { nombre, documento, telefono } = req.body;

    const [result] = await db.query(
      "INSERT INTO clientes (nombre, documento, telefono) VALUES (?, ?, ?)",
      [nombre, documento, telefono]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      documento,
      telefono,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creando cliente",
      error: error.message,
    });
  }
};

//  Actualizar cliente
export const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, documento, telefono } = req.body;

    await db.query(
      "UPDATE clientes SET nombre=?, documento=?, telefono=? WHERE id=?",
      [nombre, documento, telefono, id]
    );

    res.json({
      id,
      nombre,
      documento,
      telefono,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error actualizando cliente",
      error: error.message,
    });
  }
};

//  Eliminar cliente
export const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM clientes WHERE id=?", [id]);

    res.json({
      message: "Cliente eliminado",
      id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error eliminando cliente",
      error: error.message,
    });
  }
};