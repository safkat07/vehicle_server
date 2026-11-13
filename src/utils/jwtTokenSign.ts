import jwt from "jsonwebtoken";
import config from "../config";

const jwtTokenSign = async (payload: Record<string, unknown>) => {
  const jwtPayload = {
    id: payload.id,
    name: payload.name,
    email: payload.email,
    role: payload.role,
  };
  const secret = config.jwtSecret;
  const token = jwt.sign(jwtPayload, secret as string, { expiresIn: "1h" });
  return token;
};

export default jwtTokenSign;
