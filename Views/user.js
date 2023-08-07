const express = require("express");
const userrouter = express.Router();
const userAuth=require('../middlewares/userAuth')
const {
  register,
  login,
  
  ViewProductsByCatagory,
  ViewProductById,
  addToCart,
  showCart,
  ViewProducts,
  addToWishList,
  showWishList,
  deletewishListItems,
  stripe,
  success,
  cancel

} = require("../Controller/userController");
userrouter.post("/login", login);
userrouter.post("/register", register);
userrouter.get("/products", userAuth, ViewProducts);
userrouter.get("/products/:id", userAuth, ViewProductById);
userrouter.get(
  "/products/category/:categoryname",
  userAuth,
  ViewProductsByCatagory
);
userrouter.post("/:id/cart", userAuth, addToCart);
userrouter.get("/:id/cart", userAuth, showCart);
userrouter.post("/:id/wishlists/", userAuth, addToWishList);
userrouter.get("/:id/wishlists", userAuth, showWishList);
userrouter.delete("/:id/wishlists", userAuth, deletewishListItems);
userrouter.get('/purchase',userAuth,stripe)
userrouter.get('/purchaseSuccess/:data',success)
userrouter.get('/purchasecancel',cancel)
module.exports = userrouter;
