import * as mysql from "mysql2/promise";
import { HOST, USERNAME, PASSWORD, DB } from "./config";

export const db = {
  host: HOST,
  user: USERNAME,
  password: PASSWORD,
  database: DB,
};

async function createTables() {
  const pool = mysql.createPool(db);
  const connection = await pool.getConnection();

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

    const createTableQueries = [userTable, productsTable];
    for (const query of createTableQueries) {
      await connection.query(query);
    }

    console.log("Tables created successfully.");
  } finally {
    connection.release();
    pool.end();
  }
}

createTables();
