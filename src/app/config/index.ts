import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  BACKEND_PORT: process.env.BACKEND_PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  ENVIRONMENT: process.env.ENVIRONMENT,
};
