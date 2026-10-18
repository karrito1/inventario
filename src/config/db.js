import mysql from "mysql2/promise";
import dotenv from "dotenv";
import e from "express";

dotenv.config();

export const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "inventario",
});

export default db;

/*
Archivo de configuración de la base de datos. */