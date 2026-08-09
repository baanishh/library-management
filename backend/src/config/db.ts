import mongoose from "mongoose";
import { env } from "./env.js";
import { User } from "../modules/auth/user.model.js";

// Add Super Admin Details
async function seedSuperAdmin() {
  try {
    const adminExists = await User.findOne({ username: "admin" });
    if (!adminExists) {
      const admin = new User({
        username: "admin",
        password: "admin123",
        role: "ADMIN",
      });
      await admin.save();
      console.log(
        "Default Super Admin created: username: 'admin', password: 'admin123'",
      );
    }
  } catch (error) {
    console.error("Error while seeding super admin user:", error);
  }
}

// Monogo DB Connect
export async function connectDB() {
  if (!env.MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in configuration");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedSuperAdmin();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${(error as Error).message}`);
    process.exit(1);
  }
}
