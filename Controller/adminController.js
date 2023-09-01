require("dotenv").config();
const jwt = require("jsonwebtoken");
const userSchema = require("../Models/UserSchema");
const productSchema = require("../Models/ProductSchema");
const { productvalidate } = require("../Models/validate");

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
  viewUsersById: async (req, res, next) => {
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
  ViewProducts: async (req, res, next) => {
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
      category: req.query.category,
    });

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
    const { error, value } = productvalidate.validate(req.body);
    const { title, description, price, image, category } = value;
    if (error) {
      res.status(400).json(error.details[0].message);
    } else {
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
    }
  },
  updateProducts: async (req, res, next) => {
    const { error, value } = productvalidate.validate(req.body);
    const { title, description, price, image, category } = value;
    if (error) {
      res.status(400).json(error.details[0].message);
    } else {
      const { id } = req.body;

      await productSchema.findByIdAndUpdate(id, {
        $set: {
          title: title,
          description: description,
          price: price,
          image: image,
          category: category,
        },
      });

      res.json({
        status: "success",
        message: "Successfully updated a product.",
      });
    }
  },
  deleteProduct: async (req, res, next) => {
    if (req.body.id) {
      await productSchema.findByIdAndDelete(req.body.id);
      res.json({
        status: "success",
        message: "Successfully deleted a product.",
      });
    } else {
      res.sendStatus(403);
    }
  },
  stats: async (req, res) => {
    const details = await userSchema.aggregate([
      {
        $facet: {
          NoOfOrders: [
            { $project: { username: 1, countall: { $size: "$orders" } } },
            { $group: { _id: null, sum: { $sum: "$countall" } } },
          ],
          NoOfProducts: [
            { $unwind: "$orders" },
            {
              $project: {
                username: 1,
                countall: { $size: "$orders.products" },
              },
            },
            { $group: { _id: null, sum: { $sum: "$countall" } } },
          ],
          Revenue: [
            { $unwind: "$orders" },
            { $group: { _id: null, sum: { $sum: "$orders.totalAmount" } } },
          ],
        },
      },
    ]);
    const { NoOfOrders, NoOfProducts, Revenue } = details[0];

    res.json({
      status: "success",
      message: "Successfully fetched stats.",
      data: {
        Totalorders: NoOfOrders[0].sum,
        TotalProductsSold: NoOfProducts[0].sum,
        Revenue: Revenue[0].sum,
      },
    });
  },
  showorders: async (req, res) => {
    const orderDetails = await userSchema.aggregate([
      { $group: { _id: "$orders" } },
    ]);
    const prod = orderDetails.filter((item) => {
      if (item._id.length != 0) {
        return item._id;
      }
    });
    res.json({
      status: "success",
      message: "Successfully fetched order detail.",
      data: prod,
    });
  },
};
