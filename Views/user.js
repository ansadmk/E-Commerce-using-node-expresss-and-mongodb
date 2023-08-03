const express = require("express");
const userrouter = express.Router();
const {
  register,
  login,
  auth,
  ViewProductsByCatagory,
  ViewProductById,
  addToCart,
  showCart,
  ViewProducts,
  addToWishList,
  showWishList,
  deletewishListItems,
  stripe
} = require("../Controller/userController");
userrouter.post("/login", login);
userrouter.post("/register", register);
userrouter.get("/products", auth, ViewProducts);
userrouter.get("/products/:id", auth, ViewProductById);
userrouter.get(
  "/products/category/:categoryname",
  auth,
  ViewProductsByCatagory
);
userrouter.post("/:id/cart", auth, addToCart);
userrouter.get("/:id/cart", auth, showCart);
userrouter.post("/:id/wishlists/", auth, addToWishList);
userrouter.get("/:id/wishlists", auth, showWishList);
userrouter.delete("/:id/wishlists", auth, deletewishListItems);
userrouter.post('/purchase',auth,stripe)
module.exports = userrouter;
