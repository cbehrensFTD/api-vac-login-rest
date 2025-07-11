import { Router } from "express";
import {
  generateOtpSchema,
  getUserSchema,
  verifyOtpSchema,
  verifyTokenSchema,
} from "../schemas/auth.schema";
import {
  generateOtp,
  getUser,
  verifyOtp,
  verifyToken,
} from "../controllers/auth.controller";
import { validateResource } from "../middleware/validateResource.middleware";

const router = Router();

router.post("/verify-token", validateResource(verifyTokenSchema), verifyToken);
router.post("/generate-otp", validateResource(generateOtpSchema), generateOtp);
router.post("/verify-otp", validateResource(verifyOtpSchema), verifyOtp);
router.post("/user", validateResource(getUserSchema), getUser);

export default router;
