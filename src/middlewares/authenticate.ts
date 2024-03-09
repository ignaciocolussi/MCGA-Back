import { Response, NextFunction } from "express";
import { CustomRequest as Request } from "../interfaces/request";
import jwt from "jsonwebtoken";
import UserModel from "../models/user";
import User from "../interfaces/user";

const authenticateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (req.headers.authorization?.split(" ")[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as User;

    let user = await UserModel.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({ message: "INvalid credentials" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
export default authenticateMiddleware;
