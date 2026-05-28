import { Request, Response } from "express";
import User from "../model/user.model.js";

const userLogin = async (req: Request, res: Response,) => {
  try {
    const {
      name,
      email,
      profilePicture,
    } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error:
          "Name and email are required",
      });
    }

    // Find existing user
    let user = await User.findOne({
      email,
    });

    // Existing user
    if (user) {
      return res.status(200).json({
        success: true,
        user,
      });
    }

    const username = email.split("@")[0]


    // Create new user
    user = await User.create({
      name,
      email,
      username,
      profilePicture,
    });

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(
      "User Login Error:",
      error,
    );

    return res.status(500).json({
      success: false,
      error:
        "Internal Server Error",
    });
  }
};

const createChannel = async (req: Request, res: Response) => {
  const { channelName, channelDescription, channelUsername } = req.body

  if (!channelName || !channelDescription || !channelUsername) {
    return res.status(400).json({ error: "All fields are required" })
  }
  try {

    const existingChannelName = await User.findOne({ channelUsername }).lean()

    if (existingChannelName) {
      return res.status(400).json({
        error: "Channel name already taken",
        success: false
      })
    }

    const userId = req.user._id
    const user = await User.findByIdAndUpdate(userId, { channelName, channelDescription, channelUsername }, { returnDocument: true }).lean()

    res.status(201).json({
      success: true,
      user,
    })

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      error:
        "Internal Server Error",
    });
  }
}

export { userLogin, createChannel };