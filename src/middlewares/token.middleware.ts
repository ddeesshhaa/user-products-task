import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const auth = (req: Request, res: Response, next: any) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET as string, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.body.user = user;
    next();
  });
};
