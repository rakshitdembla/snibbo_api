import { User } from "../../models/User.js"
import jwt from "jsonwebtoken";
import { serverError } from "../../utils/server_error_res.js"
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

export const forgetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address"
        });
    }
    try {
        const user = await User.findOne({ email: email }).lean();

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found!"
            })
        }

        const token = jwt.sign({ email: email }, process.env.JWT_SECRET_KEY, {
            expiresIn: "15m"
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASSWORD,
            }
        });

        const receiver = {
            from: "app.snibbo@gmail.com",
            to: email,
            subject: "Forget your snibbo password",
            html: `
            <p>Hello 👋</p>
            <p>Click on the link below to reset your Snibbo password:</p>
            <a href="${process.env.CLIENT_URL}/reset-password/${token}" target="_blank">
              Reset Password
            </a>
            <p>This link will expire in 15 minutes.</p>
          `,

        };

        await transporter.sendMail(receiver);

        res.status(200).json({
            success: true,
            message: "Password reset link successfully sent on your email"
        });

    } catch (e) {
        serverError(res, e);
    };

}

export const resetPassword = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    if (!password) {
        return res.status(400).json({
            success: false,
            message: "Please provide a new password"
        });
    }

    try {
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOne({ email: verifyToken.email });
        const newPassword = await bcrypt.hash(password, 10);

        user.password = newPassword;
        await user.save();

        return res.status(202).json({
            success: true,
            message: "New password created successfully!"
        });

    } catch (e) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token!",
            error: e.toString()
        });
    }
}