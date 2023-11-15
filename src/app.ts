import express from "express";
import { authRouter } from "./routes/auth.routes";
import { productsRouter } from "./routes/products.routes";
import { PORT } from "./config";

const app = express();
app.use(express.json());
app.use("/auth", authRouter);
app.use("/products", productsRouter);

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
