import { Request, Response } from "express";
import { Product } from "../product";

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { title, price } = req.body;
    const userId = req.body.user.id;
    const img: string = (req.file && req.file.path) || "";
    const product = new Product(title, img, price, userId);
    await product.addProduct();
    res.status(201).json({ message: "Product created successfully" });
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "Duplicated Username" });
    } else {
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  }
};

export const viewProducts = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user.id;
    let ins = new Product(" ", " ", 0, userId);
    let products = await ins.viewProducts();
    res.status(201).json({ products });
  } catch (error: any) {
    console.log(error);
  }
};

export const editProduct = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user.id;
    let productId = req.body.productId;
    const img: string = (req.file && req.file.path) || "";
    let ins = new Product(" ", " ", 0, productId);
    let existingProduct = await ins.getProductById();
    if (typeof existingProduct[0] === "undefined")
      return res.status(403).json({ message: "No items" });
    if (userId !== existingProduct[0].user_id)
      return res.status(403).json({ message: "not owner" });

    let newTitle = req.body.title || existingProduct[0].title;
    let newPrice = req.body.price || existingProduct[0].price;
    let newImage = img || existingProduct[0].image;
    let p1 = new Product(newTitle, newImage, newPrice, productId);
    await p1.updateProduct();
    res.status(201).json("updated");
  } catch (error) {}
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user.id;
    let productId = req.body.productId;

    let product = new Product(" ", " ", 0, productId);
    let existingProduct = await product.getProductById();
    if (typeof existingProduct[0] === "undefined")
      return res.status(403).json({ message: "No items" });
    if (userId !== existingProduct[0].user_id)
      return res.status(403).json({ message: "not owner" });
    await product.deleteProduct();
    res.status(201).json("deleted");
  } catch (error) {}
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    let ins = new Product(" ", " ", 0, 0);
    let products = await ins.getAllProducts();
    res.status(201).json({ products });
  } catch (error: any) {
    console.log(error);
  }
};
