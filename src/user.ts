import { db } from "./db";
import * as mysql from "mysql2/promise";
import { RowDataPacket, FieldPacket } from "mysql2";

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

  async register() {
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

  async getUser() {
    const connection = await mysql.createConnection(db);
    try {
      let [user]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
        "SELECT COUNT(*) as count FROM USERS WHERE username =?",
        [this.username]
      );
      //   console.log(user[0].count);
      return user[0].count;
    } finally {
      await connection.end();
    }
  }

  async login() {
    const connection = await mysql.createConnection(db);
    try {
      let [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(
        "SELECT * FROM users WHERE username = ?",
        [this.username]
      );
      if (rows.length <= 0) return false;
      return rows[0];
    } finally {
      await connection.end();
    }
  }
}
