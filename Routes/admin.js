const express = require("express");
const adminrouter = express.Router();
const auth = require("../middlewares/adminAuth");
const handle=require('../middlewares/ErrorHandler')
const {
  login,
  viewUsers,
  viewUsersById,
  ViewProductById,
  ViewProductsByCatagory,
  ViewProducts,
  createProduct,
  updateProducts,
  deleteProduct,
  stats,
  showorders
} = require("../Controller/adminController");

adminrouter.post("/login", handle(login));
adminrouter.get("/users", auth,handle(viewUsers) );
adminrouter.get("/users/:id", auth, handle(viewUsersById));
adminrouter.get("/products", auth, handle(ViewProducts));
adminrouter.get(
  "/product",
  auth,
 handle(ViewProductsByCatagory)
);
adminrouter.get("/products/:id", auth,handle(ViewProductById));
adminrouter.post("/products", auth, handle(createProduct));
adminrouter.put("/products", auth, handle(updateProducts));
adminrouter.delete("/products", auth, handle(deleteProduct));
adminrouter.get("/stats", auth,handle(stats));
adminrouter.get("/orders", auth,handle(showorders));
module.exports = adminrouter;
