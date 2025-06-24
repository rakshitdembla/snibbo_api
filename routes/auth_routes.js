import express from "express";
import { loginController } from "../controllers/auth/login.js";
import { registerController } from "../controllers/auth/register.js";
import { forgetPassword, resetPassword } from "../controllers/auth/password_reset.js";

const authRouter = express.Router();

// Route for user login - expects email and password in request body
authRouter.post("/login", loginController);

// Route for user registration - expects user details in request body
authRouter.post("/register", registerController);

// Route to initiate password reset - expects email in request body
authRouter.post("/forget-password", forgetPassword);

// Route to complete password reset - expects token as URL param and new password in body
authRouter.post("/reset-password/:token", resetPassword);

export { authRouter };