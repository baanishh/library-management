import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { authenticate, requireRole } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { registerSchema, loginSchema, updateUserRoleSchema, } from "./auth.validation.js";
const router = Router();
// Public auth
router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/refresh", AuthController.refresh);
// Protected auth
router.post("/logout", authenticate, AuthController.logout);
router.get("/me", authenticate, AuthController.me);
// Admin-only user role management
router.get("/users", authenticate, requireRole(["ADMIN"]), AuthController.getUsers);
router.patch("/users/:id/role", authenticate, requireRole(["ADMIN"]), validate(updateUserRoleSchema), AuthController.updateUserRole);
export default router;
