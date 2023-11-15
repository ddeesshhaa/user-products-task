import { Request, Response } from "express";
import { db } from "../db";
import * as mysql from "mysql2/promise";
import { RowDataPacket, FieldPacket } from "mysql2";
import bcrypt from "bcrypt";
import { User } from "../user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { JWT_SECRET, JWT_EXPIRATION_TIME } from "../config";
dotenv.config();

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Please enter full info" });
    const connection = await mysql.createConnection(db);
    try {
      let [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );
      if (rows.length <= 0)
        return res.status(400).json({ message: "user notfound" });
      const user = rows[0];
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
      await connection.end();
    }
  } catch (error) {}
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, username, password } = req.body;
    if (!name || !username || !password)
      return res.status(400).json({ message: "Enter full info" });
    const connection = await mysql.createConnection(db);

    let [checkUsername]: [RowDataPacket[], FieldPacket[]] =
      await connection.query(
        "SELECT COUNT(*) as count FROM USERS WHERE username =?",
        [username]
      );
    if (checkUsername[0].count != 0) {
      return res.status(400).json({ message: "Duplicated Username" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(name, username, hashedPassword);
    await user.saveToDatabase();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
