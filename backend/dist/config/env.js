import dotenv from "dotenv";
dotenv.config();
export const env = {
    PORT: parseInt(process.env.PORT || "5050", 10),
    MONGO_URI: process.env.MONGO_URI || "",
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "default_access_token_secret_key_12345",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET ||
        "default_refresh_token_secret_key_67890",
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
    NODE_ENV: process.env.NODE_ENV || "development",
};
if (!process.env.MONGO_URI) {
    console.warn("[Warning] MONGO_URI is missing in environment variables.");
}
