let dotenv = require("dotenv").config();

export const {
  HOST,
  USERNAME,
  PASSWORD,
  DB,
  JWT_SECRET,
  JWT_EXPIRATION_TIME,
  PORT,
} = process.env;
