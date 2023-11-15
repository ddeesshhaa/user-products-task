import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../user";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRATION_TIME } from "../config";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Please enter full info" });
    try {
      let ins = new User(" ", username, " ");
      let user = await ins.login();
      if (!user) return res.status(400).json({ message: "user notfound" });
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { id: user.id, username: user.username },
          JWT_SECRET as string,
          {
            expiresIn: JWT_EXPIRATION_TIME,
          }
        );
        res.json({ token });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    } finally {
    }
  } catch (error) {}
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, username, password } = req.body;
    if (!name || !username || !password)
      return res.status(400).json({ message: "Enter full info" });
    let ins = new User(" ", username, " ");
    let checkUsername = await ins.getUser();
    if (checkUsername != 0) {
      return res.status(400).json({ message: "Duplicated Username" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(name, username, hashedPassword);
    await user.register();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
