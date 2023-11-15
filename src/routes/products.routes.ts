import express, { Router } from "express";
import {
  addProduct,
  viewProducts,
  editProduct,
  deleteProduct,
} from "../middlewares/products.middleware";
import { auth } from "../middlewares/token.middleware";

export const productsRouter: Router = express.Router();

productsRouter.post("/addProduct", auth, addProduct);
productsRouter.get("/viewProducts", auth, viewProducts);
productsRouter.put("/editProduct", auth, editProduct);
productsRouter.delete("/deleteProduct", auth, deleteProduct);
