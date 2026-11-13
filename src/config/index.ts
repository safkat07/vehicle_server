import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  port: process.env.PORT || 8000,
  databaseURI: process.env.DATABASE_URI || "",
  jwtSecret: process.env.JWT_SECRET,
  nodeENV: process.env.NODE_ENV,
  secret: process.env.JWT_SECRET,
};
export default config;
