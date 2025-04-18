import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    const { username } = req.body || user.username;
    const { name } = req.body || user.name;
    const { profilePicture } = req.body || user.profilePicture;
    const { bio } = req.body || user.bio;

    const updatedUser = await User.findByIdAndUpdate(userId, {
      username: username,
      name: name,
      profilePicture: profilePicture,
      bio: bio
    }, {
      new: true
    }).select("-_id");

    return res.status(201).json({
      success: true,
      message: "Profile updated successfully.",
      updatedUser
    })

  } catch (e) {
    serverError(res, e);
  }
}