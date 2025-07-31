import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;

    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully.",
      success: true,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      message: "Internal Server Error.",
      success: false,
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(403).json({
        message: "Access denied for this role.",
        success: false,
      });
    }

    const tokenPayload = { userId: user._id, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    console.log(token);

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back, ${user.fullName}!`,
        user: userData,
        success: true,
      });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({
      message: "Internal Server Error.",
      success: false,
    });
  }
};


export const logout = async (req,res) => {
    try {
        return res
        .status(200)
        .cookie("token", "", {maxAge:0})
        .json({
            message:"Logged out successfully",
            success: true
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({
        message: "Internal Server Error.",
        success: false,
        });
    }
}
export const updateProfile = async (req, res) => {
    try {
      const { fullName, email, phoneNumber, bio, role, skills } = req.body;
      const file = req.file;
  
      if (!fullName || !email || !phoneNumber || !role || !skills) {
        return res.status(400).json({
          message: "All fields are required.",
          success: false,
        });
      }
  
      const skillsArray = skills.split(",").map(s => s.trim());
      const userId = req.id;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }
  
      user.fullName = fullName;
      user.email = email;
      user.phoneNumber = phoneNumber;
      user.role = role;
      user.profile.bio = bio;
      user.profile.skills = skillsArray;
  
      await user.save();
  
      return res.status(200).json({
        message: "Profile updated successfully",
        success: true,
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });
    }
  };
  