import { Request, Response } from "express";
import { db } from "../db";
import * as mysql from "mysql2/promise";
import { RowDataPacket, FieldPacket } from "mysql2";
import { User } from "../user";
import { Product } from "../product";

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { title, image, price } = req.body;
    const userId = req.body.user.id;
    const product = new Product(title, image, price, userId);
    await product.saveToDatabase();
    res.status(201).json({ message: "Product created successfully" });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "Duplicated Username" });
    } else res.status(500).json({ message: "Internal server error" });
  }
};

export const viewProducts = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user.id;
    let connection = await mysql.createConnection(db);
    let [products]: [RowDataPacket[], FieldPacket[]] = await connection.query(
      "SELECT * FROM PRODUCTS WHERE user_id = ?",
      [userId]
    );
    res.status(201).json({ products });
  } catch (error: any) {
    console.log(error);
  }
};

export const editProduct = async (req: Request, res: Response) => {
  let connection = await mysql.createConnection(db);
  try {
    const userId = req.body.user.id;
    let productId = req.body.productId;
    let [product]: [RowDataPacket[], FieldPacket[]] = await connection.query(
      "SELECT * FROM PRODUCTS WHERE id = ?",
      [productId]
    );
    if (typeof product[0] === "undefined" || userId !== product[0].user_id)
      return res.status(204).json({ message: "FORBIDDEN" });

    let newTitle = req.body.title || product[0].title;
    let newPrice = req.body.price || product[0].price;
    let newImage = req.body.image || product[0].image;
    let p1 = new Product(newTitle, newImage, newPrice, productId);
    await p1.updateProduct();
    res.status(201).json("updated");
  } finally {
    await connection.end();
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  let connection = await mysql.createConnection(db);
  try {
    const userId = req.body.user.id;
    let productId = req.body.productId;
    let [product]: [RowDataPacket[], FieldPacket[]] = await connection.query(
      "SELECT * FROM PRODUCTS WHERE id = ?",
      [productId]
    );

    let p1 = new Product("", "", 0, productId);
    if (typeof product[0] === "undefined" || userId !== product[0].user_id)
      return res.status(403).json({ message: "FORBIDDEN" });
    await p1.deleteProduct();
    res.status(201).json("deleted");
  } finally {
    await connection.end();
  }
};
