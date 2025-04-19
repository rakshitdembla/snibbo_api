import { User } from "../../models/User.js";
import bcrypt from 'bcrypt';
import { serverError } from "../../utils/server_error_res.js";

export const loginController = async (req, res) => {
    
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email & Password is mandatory in body."
            });
        }
        const user = await User.findOne({ email: email }).lean();

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

        return res.status(200).json({
            success: true,
            message: "User logged-in successfully!",
            user
        });
    } catch (e) {
        serverError(res,e);
    }
}