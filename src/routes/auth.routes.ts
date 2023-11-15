import express, { Router, Request, Response, NextFunction } from "express";
import { login, register } from "../middlewares/auth.middleware";

export const authRouter: Router = express.Router();

authRouter.post("/login", login);

authRouter.post("/register", register);
