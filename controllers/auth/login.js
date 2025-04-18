import { User } from "../../models/User.js";
import bcrypt from 'bcrypt';
import { serverError } from "../../utils/server_error_res.js";
import jwt from "jsonwebtoken";

export const loginController = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email & Password is mandatory in body."
            });
        }
        const user = await User.findOne({ email }).lean().select("-_id");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email not found. Please register first."

            })
        }
        
        const verifyPass = await bcrypt.compare(password, user.password);

        if (!verifyPass) {
            return res.status(401).json({
                success: false,
                message: "Wrong password."

            })
        }

        const token = jwt.sign({userId: user._id},process.env.JWT_SECRET_KEY,{
                    expiresIn: "7d"
                });

        return res.status(200).json({
            success: true,
            message: "User logged-in successfully!",
            token,
            user
        });
    } catch (e) {
        serverError(res, e);
    }
}