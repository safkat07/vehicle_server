import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import jwtTokenSign from "../../utils/jwtTokenSign";

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email= $1`, [
    email,
  ]);

  if (result.rows.length < 0 || result.rows.length === 0) {
    throw new Error("User not Found");
  }

  const user = result.rows[0];
  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new Error("Invalid Credintial");
  }
  const { password: dbPassword, ...userWithoutPassword } = user;
  const token = await jwtTokenSign(userWithoutPassword);
  return { token, user: userWithoutPassword };
};

export const auth_services = {
  loginUser,
};
