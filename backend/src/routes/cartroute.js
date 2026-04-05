import express from "express";
import { addToCart, getCart, updateCart, removeCart } from "../controler/cartcontroller.js";
import authMiddleware from "../middleware/authmiddleware.js"

const cartRouter = express.Router();

cartRouter.post("/", authMiddleware, addToCart);

cartRouter.get("/", authMiddleware, getCart);

cartRouter.put("/:id", authMiddleware, updateCart);

cartRouter.delete("/:id", authMiddleware, removeCart);

export default cartRouter;  