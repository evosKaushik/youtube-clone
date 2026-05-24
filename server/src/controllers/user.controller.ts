import express from "express";
import User from "../model/user.model.js";

const userLogin = async (
  req: express.Request,
  res: express.Response,
) => {
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

    // Create new user
    user = await User.create({
      name,
      email,
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

export { userLogin };