import Product from "../models/Product.js";
// all api tested in postman all are giveing corrrect response 
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL PRODUCTS (User)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE PRODUCT (Admin)
export const deleteProduct = async (req, res) => {
  try {
    console.log("Delete product called with ID:", req.params.id);
    const result = await Product.findByIdAndDelete(req.params.id.trim());
    console.log("Delete result:", result);
    if (!result) {
      return res.status(404).json({ success: false, message: "Product not found in DB" });
    }
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE PRODUCT DETAIL BY ADMIN
export const updateProduct = async (req, res) => {
  try {

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id.trim(),
      req.body,
      { returnDocument: "after" }  // { new:true helps to return the updated document to the DB }
    );

    res.json({
      success: true,
      product: updatedProduct
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
