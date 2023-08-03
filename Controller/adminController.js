require("dotenv").config();
const jwt = require("jsonwebtoken");
const userSchema = require("../Models/UserSchema");
const productSchema = require("../Models/ProductSchema");

module.exports = {
  login: (req, res) => {
    const { username, password } = req.body;
    if (username == "Admin" && password == "Admin") {
      const token = jwt.sign(req.body, process.env.ACCESS_TOKEN_SECRET);
      res.status(200).json({
        status: "success",
        message: "Successfully logged In.",
        data: { jwt_token: token },
      });
    } else {
      res.status(200).json({
        status: "failed",
        message: "inCorrect password or username",
      });
    }
  },
  auth: (req, res, next) => {
    const auth = req.headers["authorization"];
    const token = auth && auth.split(" ")[1];
    if (token) {
      const { username, password } = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      );
      if (username == "Admin" && password == "Admin") {
        next();
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  },
  viewUsers: async (req, res) => {
    const users = await userSchema.find().populate("cart wishlist");
    if (users) {
      res.status(200).json({
        status: "success",
        message: "Successfully fetched user datas.",
        data: users,
      });
    } else {
      res, sendStatus(404);
    }
  },
  viewUsersById: async (req, res) => {
    const user = await userSchema
      .findById(req.params.id)
      .populate("cart wishlist");
    if (user) {
      res.status(200).json({
        status: "success",
        message: "Successfully fetched user datas.",
        data: user,
      });
    } else {
      res, sendStatus(404);
    }
  },
  ViewProducts: async (req, res) => {
    const foundProducts = await productSchema.find();

    if (foundProducts) {
      res.status(200).json({
        status: "success",
        message: "Successfully fetched products detail.",
        data: foundProducts,
      });
    } else {
      res.json("Notfound");
      res.sendStatus(204);
    }
  },
  ViewProductsByCatagory: async (req, res) => {
    const foundProducts = await productSchema.find({
      category: req.params.categoryname,
    });
    console.log(req.params.categoryname);
    if (foundProducts) {
      res.status(200).json({
        status: "success",
        message: "Successfully fetched products detail.",
        data: foundProducts,
      });
    } else {
      res.json("Notfound");
      res.sendStatus(204);
    }
  },
  ViewProductById: async (req, res) => {
    const prod = await productSchema.findById(req.params.id);
    if (prod) {
      res.status(200).json({
        status: "success",
        message: "Successfully fetched products detail.",
        data: prod,
      });
    } else {
      res.sendStatus(404);
    }
  },
  createProduct: async (req, res) => {
    try {
      const { title, description, price, image, category } = req.body;

      await productSchema.create({
        title: title,
        description: description,
        price: price,
        image: image,
        category: category,
      });
      res.status(201).json({
        status: "success",
        message: "Successfully created a product.",
      });
    } catch (error) {
      console.log(error.message);
      res, sendStatus(301);
    }
  },
  updateProducts: async (req, res) => {
    try {
      const { id, title, description, price, image, category } = req.body;

      if (category) {
        await productSchema.findByIdAndUpdate(id, {
          $set: { category: category },
        });
      }
      if (image) {
        await productSchema.findByIdAndUpdate(id, { $set: { image: image } });
      }
      if (price) {
        await productSchema.findByIdAndUpdate(id, { $set: { price: price } });
      }
      if (description) {
        await productSchema.findByIdAndUpdate(id, {
          $set: { description: description },
        });
      }
      if (title) {
        await productSchema.findByIdAndUpdate(id, { $set: { title: title } });
      }

      res.json({
        status: "success",
        message: "Successfully updated a product.",
      });
    } catch (error) {
      console.log(error.message);
    }
  },
  deleteProduct: async (req, res) => {
    if (req.body.id) {
      await productSchema.findOneAndDelete(req.body.id);
      res.json({
        status: "success",
        message: "Successfully deleted a product.",
      });
    } else {
      res.sendStatus(403);
    }
  },
};
