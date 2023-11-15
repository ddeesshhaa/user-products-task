import express, { Router } from "express";
import {
  addProduct,
  viewProducts,
  editProduct,
  deleteProduct,
  getAllProducts,
} from "../middlewares/products.middleware";
import { auth } from "../middlewares/token.middleware";
import upload from "../multer";

export const productsRouter: Router = express.Router();

productsRouter.post("/addProduct", upload.single("image"), auth, addProduct);
productsRouter.get("/viewProducts", auth, viewProducts);
productsRouter.put("/editProduct", upload.single("image"), auth, editProduct);
productsRouter.delete("/deleteProduct", auth, deleteProduct);
productsRouter.get("/getAllProducts", auth, getAllProducts);
