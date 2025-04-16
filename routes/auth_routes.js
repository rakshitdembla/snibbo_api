import express from "express";
import { loginController } from "../controllers/auth/login.js";
import { registerController } from "../controllers/auth/register.js";
import { forgetPassword, resetPassword } from "../controllers/auth/password_reset.js";

const authRouter = express.Router();

authRouter.post("/login", loginController);
authRouter.post("/register", registerController);
authRouter.post("/forget-password", forgetPassword);
authRouter.post("/reset-password/:token", resetPassword);

export { authRouter };