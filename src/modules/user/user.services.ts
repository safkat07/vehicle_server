import { pool } from "../../config/db";
import bcrypt from "bcrypt";

const create_user_DB = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  if (!password || typeof password !== "string" || password.trim() === "") {
    throw new Error("Password cannot be empty");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
  const hashPassword = await bcrypt.hash(password as string, 10);
  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [name, email, hashPassword, phone, role],
  );

  return result;
};

const get_user_DB = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

export const user_services = {
  create_user_DB,
  get_user_DB,
};
