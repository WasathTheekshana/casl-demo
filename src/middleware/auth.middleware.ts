import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export const authMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "no token privided!" });
    }

    const decoded = jwt.verify(token!, process.env.JWT_SECRET_KEY! as string) as {
      userId: string;
    };
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ message: "user not found!" });
    }

    req.user = user!;
    next();
  } catch (error) {
    res.status(401).json({ message: "invalid token!" });
  }
};
