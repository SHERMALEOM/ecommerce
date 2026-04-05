import express from "express";
import {createOrder,getUserOrders,getSingleOrder,getAllOrders,updateOrderStatus} from "../controler/ordercontoller.js";
import authMiddleware  from "../middleware/authmiddleware.js";
import isAdmin from "../middleware/adminmidlleware.js";

const orderRouter = express.Router();

// create order
orderRouter.post("/", authMiddleware, createOrder);

// get logged in user orders
orderRouter.get("/", authMiddleware, getUserOrders);

// admin get all orders
orderRouter.get("/admin", authMiddleware, isAdmin, getAllOrders);

// get single order
orderRouter.get("/:id", authMiddleware, getSingleOrder);


// update order status
orderRouter.put("/:id", authMiddleware, isAdmin, updateOrderStatus);

export default orderRouter;