let dotenv = require("dotenv");

let result = dotenv.config();
if (result.error) {
  console.error(`error loading env ${result.error}`);
}

export const {
  HOST,
  USERNAME,
  PASSWORD,
  DB,
  JWT_SECRET,
  JWT_EXPIRATION_TIME,
  PORT,
} = process.env;
