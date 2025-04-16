import { User } from "../../models/User.js";
import bcrypt from 'bcrypt';
import { serverError } from "../../utils/server_error_res.js";

export const loginController = async (req, res) => {
    
  try {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are mandatory in the body!"
        });
    }
        const user = await User.findOne({ email }).lean();
        const verifyPass = user ? await bcrypt.compare(password, user.password) : null;

        if (!verifyPass) {
            return res.status(401).json({
                success: false,
                message: "Password or Email doesn't match."

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