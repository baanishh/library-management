import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { authenticate, requireRole } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { loginSchema, createStaffSchema } from "./auth.validation.js";

const router = Router();

router.post("/login", validate(loginSchema), AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", authenticate, AuthController.logout);
router.get("/me", authenticate, AuthController.me);

// Admin-only staff management routes
router.post(
  "/staff",
  authenticate,
  requireRole("ADMIN"),
  validate(createStaffSchema),
  AuthController.createStaff,
);
router.get(
  "/users",
  authenticate,
  requireRole("ADMIN"),
  AuthController.getUsers,
);
router.delete(
  "/users/:id",
  authenticate,
  requireRole("ADMIN"),
  AuthController.deleteUser,
);

export default router;
