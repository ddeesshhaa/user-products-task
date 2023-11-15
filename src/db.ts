import * as mysql from "mysql2/promise";
import { HOST, USERNAME, PASSWORD, DB } from "./config";

export const db = {
  host: HOST,
  user: USERNAME,
  password: PASSWORD,
  database: DB,
};

async function createTables() {
  const connection = await mysql.createConnection(db);
  try {
    const userTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const productsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      image TEXT,
      price DECIMAL(10, 2),
      user_id INT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

      )
      `;
    await connection.execute(userTable);
    await connection.execute(productsTable);
    console.log("Table created successfully.");
  } finally {
    await connection.end();
  }
}

createTables();
