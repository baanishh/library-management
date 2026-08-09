import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || "5050", 10),

  MONGO_URI: process.env.MONGO_URI || "",

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",

  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",

  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "15m",

  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d",

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

  NODE_ENV: process.env.NODE_ENV || "development",
};

if (!env.MONGO_URI || !env.ACCESS_TOKEN_SECRET || !env.REFRESH_TOKEN_SECRET) {
  throw new Error("Missing required environment variables");
}
