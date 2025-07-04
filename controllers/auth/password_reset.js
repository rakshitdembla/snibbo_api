import { User } from "../../models/User.js"
import jwt from "jsonwebtoken";
import { serverError } from "../../utils/server_error_res.js"
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address."
            });
        }

        const user = await User.findOne({ email: email }).lean();

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email not found."
            });
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
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
              <title>Reset Your Snibbo Password</title>
              <style>
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  background-color: #f3f4f6;
                  color: #1f2937;
                  padding: 40px 20px;
                  margin: 0;
                }
                .container {
                  max-width: 480px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  border-radius: 16px;
                  padding: 32px;
                  box-shadow: 0 0 14px rgba(0, 0, 0, 0.07);
                }
                h2 {
                  font-size: 22px;
                  margin-bottom: 16px;
                }
                p {
                  font-size: 15px;
                  line-height: 1.6;
                  margin: 12px 0;
                }
                .button {
                  display: inline-block;
                  margin-top: 20px;
                  background-color: #4f46e5;
                  color: #ffffff !important;
                  padding: 12px 24px;
                  border-radius: 10px;
                  text-decoration: none;
                  font-weight: 600;
                  transition: background-color 0.3s ease;
                }
                .button:hover {
                  background-color: #4338ca;
                }
                .footer {
                  margin-top: 30px;
                  font-size: 12px;
                  color: #6b7280;
                  text-align: center;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Hello 👋</h2>
                <p>Click the button below to reset your Snibbo password:</p>
                <a href="${process.env.CLIENT_URL}/reset-password/${token}" class="button" target="_blank">
                  Reset Password
                </a>
                <p>This link will expire in 15 minutes. If you didn't request this, feel free to ignore this message.</p>
                <div class="footer">
                  © ${new Date().getFullYear()} Snibbo. All rights reserved.
                </div>
              </div>
            </body>
            </html>
            `,
        };

        await transporter.sendMail(receiver);

        res.status(200).json({
            success: true,
            message: "Password reset link successfully sent on your email"
        });

    } catch (e) {
        serverError(res, e);
    }
};

export const resetPassword = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Please provide a new password"
            });
        }

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