import { Request, Response } from "express";
import User from "../model/user.model.js";
import { SOUTH_STATES } from "../constant/constant.js";
import crypto from "node:crypto"
import { sendOTP } from "../services/resend.js";

const otpSession = new Map();

const userLogin = async (req: Request, res: Response,) => {
  try {
    const {
      name,
      email,
      profilePicture,
      userState,

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
      userState,
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
    const user = await User.findByIdAndUpdate(userId, { channelName, channelDescription, channelUsername }, { new: true }).lean()

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



const registerController = async (req: Request, res: Response) => {
  const {
    name,
    username,
    email,
    password,
    phoneNumber,
    userState
  } = req.body
  try {

    if (!name || !username || !email || !password || !phoneNumber || !userState) {
      return res.status(400).json({ error: "All fields are required", success: false })
    }

    const existingUser = await User.findOne({ email }).lean()

    if (existingUser) return res.status(400).json({ error: "User already exists", success: false })



    const generatedOTP = crypto.randomInt(0, 10000)
      .toString()
      .padStart(4, "0");

    // Todo: SMS OTP based on state    
    // if (SOUTH_STATES.includes(userState)) {
    //     // Email OTP
    //     res.status(201).json({message: "OTP send to Email successfully", success: true})
    // } else {
    //     // Mobile OTP
    //     res.status(201).json({message: "OTP send to your Mobile number successfully", success: true})
    // }


    const newUser = await User.create({
      name,
      username,
      email,
      password,
      phoneNumber,
      userState,
      verified: false,
    })

    otpSession.set(email, generatedOTP)

    const otpResult = await sendOTP(email, generatedOTP)
    console.log(otpResult)

    if (!otpResult) {
      return res.status(500).json({ error: "Failed to send OTP", success: false })
    }


    console.log(`OTP send to ${email}: ${generatedOTP}`)
    console.log(otpSession.get(email))

    res.status(201).json({
      message: "OTP sent successfully",
      success: true,
      userId: newUser._id,

    })

  } catch (error) {
    console.log(
      "User register Error:",
      error,
    );

    return res.status(500).json({
      success: false,
      error:
        "Internal Server Error",
    });
  }
}

const verifyOTPController = async (req: Request, res: Response) => {
  const { email, otp } = req.body

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required", success: false })
  }

  const storedOTP = otpSession.get(email)

  if (!storedOTP) {
    return res.status(400).json({ error: "No OTP found for this email", success: false })
  }

  if (storedOTP !== otp) {
    return res.status(400).json({ error: "Invalid OTP", success: false })
  }

  try {
    // Mark user as verified
    const updatedUser = await User.findOneAndUpdate({ email }, { verified: true }, { returnDocument: 'after' }).select("-password -__v").lean();

    // Remove OTP from session
    otpSession.delete(email)

    res.status(200).json({ message: "OTP verified successfully", success: true, user: updatedUser })
  } catch (error) {
    console.error("Error occurred while verifying OTP:", error);
    return res.status(500).json({ error: "Internal Server Error", success: false });
  }
}

const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required", success: false })
  }

  try {
    const user = await User.findOne({ email }).select("-__v").lean()

    if (!user) {
      return res.status(400).json({ error: "User not found", success: false })
    }

    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid password", success: false })
    }

    if (!user.verified) {
      return res.status(400).json({ error: "User not verified. Please verify your account.", success: false })
    }

    res.status(200).json({ message: "Login successful", success: true, user })

  } catch (error) {
    console.error("Error occurred while logging in:", error);
    return res.status(500).json({ error: "Internal Server Error", success: false });
  }
}
export { userLogin, createChannel, registerController, loginController, verifyOTPController };