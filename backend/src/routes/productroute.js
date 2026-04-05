import express from "express";
import {createProduct,getProducts,getSingleProduct,deleteProduct,updateProduct} from "../controler/productcontroller.js"
import isAdmin from "../middleware/adminmidlleware.js"
import authMiddleware from "../middleware/authmiddleware.js";
const productRouter = express.Router();

productRouter.post("/",authMiddleware, isAdmin,createProduct);        // admin
productRouter.delete("/:id",isAdmin, deleteProduct);   // admin
productRouter.get("/", getProducts);           // user
productRouter.get("/:id", getSingleProduct);   // user
productRouter.put("/:id", authMiddleware, isAdmin, updateProduct);

export default productRouter;