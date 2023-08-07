const express = require("express");
const adminrouter = express.Router();
const auth=require('../middlewares/adminAuth')
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
} = require("../Controller/adminController");
adminrouter.post("/login", login);
adminrouter.get("/users", auth, viewUsers);
adminrouter.get("/users/:id", auth, viewUsersById);
adminrouter.get("/products", auth, ViewProducts);
adminrouter.get(
  "/products/category/:categoryname",
  auth,
  ViewProductsByCatagory
);
adminrouter.get("/products/:id", auth, ViewProductById);
adminrouter.post("/products", auth, createProduct);
adminrouter.put("/products", auth, updateProducts);
adminrouter.delete("/products", auth, deleteProduct);
adminrouter.get("/stats", auth);
adminrouter.get("/orders", auth);
module.exports = adminrouter;
