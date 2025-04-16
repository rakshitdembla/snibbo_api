import { User } from "../../models/User.js";
import bcrypt from 'bcrypt';
import { serverError } from "../../utils/server_error_res.js";

export const registerController = async (req, res) => {
    try {
        const { username, name, email, password } = req.body;

        if (!username, !name, !email, !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory in the body!"
            })
        }
        const emailExists = await User.findOne({ email }).lean();

        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists!"
            });
        }

        const usernameExists = await User.findOne({ username }).lean();

        if (usernameExists) {
            return res.status(400).json({
                success: false,
                message: "Username is already taken. Please choose a unqiue username."
            });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username: username,
            name: name,
            email: email,
            password: encryptedPassword
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully!",
            user
        });


    } catch (e) {
        serverError(res, e);
    }
}