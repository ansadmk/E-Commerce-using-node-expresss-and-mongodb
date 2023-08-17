const express = require("express");
const userrouter = express.Router();
const userAuth=require('../middlewares/userAuth')
const handle=require('../middlewares/ErrorHandler')
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
userrouter.post("/login", handle(login));
userrouter.post("/register", handle(register));
userrouter.get("/products", userAuth, handle(ViewProducts) );
userrouter.get("/products/:id", userAuth, handle(ViewProductById));
userrouter.get(
  "/products/category/:categoryname",
  userAuth,
  handle(ViewProductsByCatagory)
);
userrouter.post("/:id/cart", userAuth, handle(addToCart));
userrouter.get("/:id/cart", userAuth, handle(showCart));
userrouter.post("/:id/wishlists/", userAuth, handle(addToWishList));
userrouter.get("/:id/wishlists", userAuth, handle(showWishList));
userrouter.delete("/:id/wishlists", userAuth, handle(deletewishListItems));
userrouter.get('/purchase',userAuth,handle(stripe))
userrouter.get('/purchaseSuccess',success)
userrouter.get('/purchasecancel',cancel)
module.exports = userrouter;
