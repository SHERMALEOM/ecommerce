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
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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