import Cart from "../models/Cart.js"
// import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  try {

    const userId = req.user.id;
    const { product, quantity } = req.body;

    // check if product already exists in cart
    let cartItem = await Cart.findOne({
      user: userId,
      product: product
    });

    if (cartItem) {

      // product already exists → increase quantity
      cartItem.quantity += quantity;

      await cartItem.save();

      return res.json({
        success: true,
        message: "Cart quantity updated",
        cartItem
      });

    } else {

      // create new cart item
      cartItem = await Cart.create({
        user: userId,
        product,
        quantity
      });

      return res.status(201).json({
        success: true,
        message: "Product added to cart",
        cartItem
      });
    }

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


export const getCart = async (req, res) => {
  try {
    
    const cart = await Cart.find({ user: req.user.id })
      .populate("product");

    res.json({
      success: true,
      cart
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

export const updateCart = async (req, res) => {
  try {

    const cart = await Cart.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    );

    res.json({
      success: true,
      cart
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

export const removeCart = async (req, res) => {
  try {

    await Cart.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Item removed from cart"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};