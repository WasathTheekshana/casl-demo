import { Request, Response, RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const register: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        email,
        password: hashedPassword,
        role: role || "user",
      });

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET_KEY!,
        {
          expiresIn: "1d",
        }
      );

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during registration",
    });
  }
};

export const login: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    } else {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          res.status(401).json({
            success: false,
            message: "Invalid credentials",
          });
        } else {
          const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET_KEY!,
            { expiresIn: "1d" }
          );

          res.json({
            success: true,
            token,
            user: {
              id: user._id,
              email: user.email,
              role: user.role,
            },
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during login",
    });
  }
};

export const getProfile: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
};
