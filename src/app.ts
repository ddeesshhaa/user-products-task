import express from "express";
import { authRouter } from "./routes/auth.routes";
import { productsRouter } from "./routes/products.routes";
import { PORT } from "./config";
import morgan from "morgan";

const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/products", productsRouter);

app.use((req, res, next) => {
  res.status(404).send({ en: "Error 404 Not Found", ar: " 404 غير موجود" });
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
