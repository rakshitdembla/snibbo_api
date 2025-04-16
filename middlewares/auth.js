import { User } from "../models/User.js"

export const isAuthenticated = async (req, res, next) => {
    try {
        const {user_id} = req.headers;
        console.log("Header userId:", user_id);

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user!"
            });
        }

        const user = await User.findById(user_id).lean();

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found!"
            });
        }

        req.userId = user_id;
        next();

    } catch (e) {
        return res.status(401).json({
            success: false,
            message: "Invalid user-id!",
            error: e.toString()
        });
    }
}

