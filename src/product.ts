import { db } from "./db";
import * as mysql from "mysql2/promise";
import { RowDataPacket, FieldPacket } from "mysql2";

export class Product {
  private title: string;
  private image: string;
  private price: number;
  private userId: number;

  constructor(title: string, image: string, price: number, userId: number) {
    this.title = title;
    this.image = image;
    this.price = price;
    this.userId = userId;
  }

  async addProduct() {
    const connection = await mysql.createConnection(db);
    try {
      await connection.execute(
        "INSERT INTO products (title, image, price, user_id) VALUES (?, ?, ?, ?)",
        [this.title, this.image, this.price, this.userId]
      );
    } finally {
      await connection.end();
    }
  }
  async updateProduct() {
    const connection = await mysql.createConnection(db);
    try {
      await connection.execute(
        "UPDATE products SET title = ?, image = ?, price = ? WHERE id = ?",
        [this.title, this.image, this.price, this.userId]
      );
    } finally {
      await connection.end();
    }
  }

  async deleteProduct() {
    const connection = await mysql.createConnection(db);
    try {
      await connection.execute("DELETE FROM products WHERE id = ?", [
        this.userId,
      ]);
    } finally {
      await connection.end();
    }
  }

  async viewProducts() {
    let connection = await mysql.createConnection(db);
    try {
      let [products]: [RowDataPacket[], FieldPacket[]] = await connection.query(
        "SELECT * FROM PRODUCTS WHERE user_id = ?",
        [this.userId]
      );
      return products;
    } finally {
      await connection.end();
    }
  }

  async getProductById() {
    let connection = await mysql.createConnection(db);
    try {
      let [product]: [RowDataPacket[], FieldPacket[]] = await connection.query(
        "SELECT * FROM PRODUCTS WHERE id = ?",
        [this.userId]
      );
      return product;
    } finally {
      await connection.end();
    }
  }

  async getAllProducts() {
    let connection = await mysql.createConnection(db);
    try {
      let [products]: [RowDataPacket[], FieldPacket[]] = await connection.query(
        "SELECT * FROM PRODUCTS"
      );
      return products;
    } finally {
      await connection.end();
    }
  }
}
