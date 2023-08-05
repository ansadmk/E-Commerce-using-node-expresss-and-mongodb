require("dotenv").config();
const jwt = require("jsonwebtoken");
const userSchema = require("../Models/UserSchema");
const productSchema = require("../Models/ProductSchema");

module.exports = {
  login: (req, res,next) => {
    try {
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
    } catch (error) {
      next(error)
    }
  },
  auth: (req, res, next) => {
    try {
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
    } catch (error) {
      next(error)
    }
    
  },
  viewUsers: async (req, res,next) => {
    try {
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
    } catch (error) {
      next(error)
    }
  },
  viewUsersById: async (req, res,next) => {
    try {
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
    } catch (error) {
      next(error)
    }
  },
  ViewProducts: async (req, res,next) => {
    try {
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
    } catch (error) {
      next(error)
    }
  },
  ViewProductsByCatagory: async (req, res,next) => {
    try {
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
    } catch (error) {
      next(error)
    }
  },
  ViewProductById: async (req, res,next) => {
    try {
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
    } catch (error) {
      next(error)
    }
  },
  createProduct: async (req, res,next) => {
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
      next(error)
    }
  },
  updateProducts: async (req, res,next) => {
    try {
      const { id, title, description, price, image, category } = req.body;

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
    } catch (error) {
      next(error)
    }
  },
  deleteProduct: async (req, res,next) => {
    try {
      if (req.body.id) {
        await productSchema.findByIdAndDelete(req.body.id);
        res.json({
          status: "success",
          message: "Successfully deleted a product.",
        });
      } else {
        res.sendStatus(403);
      }
    } catch (error) {
      next(error)
    }
  },
};
