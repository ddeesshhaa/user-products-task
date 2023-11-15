import { db } from "./db";
import * as mysql from "mysql2/promise";

export class User {
  private id: number;
  private name: string;
  private username: string;
  private password: string;

  constructor(name: string, username: string, password: string) {
    this.id = 0;
    this.name = name;
    this.username = username;
    this.password = password;
  }

  async saveToDatabase() {
    const connection = await mysql.createConnection(db);
    try {
      const [result, fields] = await connection.execute(
        "INSERT INTO users (name,username, password) VALUES (?,?, ?)",
        [this.name, this.username, this.password]
      );
      this.id = (result as mysql.ResultSetHeader).insertId;
    } finally {
      await connection.end();
    }
  }
}
