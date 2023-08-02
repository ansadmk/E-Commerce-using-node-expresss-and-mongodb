const userSchema = require("../Models/UserSchema");
const productSchema = require("../Models/ProductSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  register: async (req, res) => {
    const { username, password, email } = req.body;
    await userSchema.create({
      username: username,
      email: email,
      password: password,
    });
    res.json({ status: "success" });
  },
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await userSchema.find({
        username: username,
        password: password,
      });
      const userdetails = {
        username: user[0].username,
        password: user[0].password,
      };
      const token = jwt.sign(userdetails, process.env.ACCESS_TOKEN_SECRET);
      if (token) {
        res.json({
          jwt_token: token,
        });
      }
    } catch (error) {
      res.sendStatus(401);
      console.log(error.message);
    }
  },
  auth: (req, res, next) => {
    try {
      const auth = req.headers["authorization"];
      const token = auth && auth.split(" ")[1];
      if (token) {
        const verify = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (verify) {
          next();
        }
      } else {
        res.sendStatus(401);
      }
    } catch (error) {
      res.sendStatus(401);
      console.log(error.message);
    }
  },
  ViewProducts: async (req, res) => {
    const foundProducts = await productSchema.find();

    if (foundProducts) {
      res.json(foundProducts);
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
      res.json(foundProducts);
    } else {
      res.json("Notfound");
      res.sendStatus(204);
    }
  },
  ViewProductById: async (req, res) => {
    
  const prod = await productSchema.findById(req.params.id);
    if (prod) {
      
      res.json(prod);
    } else {
      res.sendStatus(404)
    }
  },
  addToCart: async (req, res) => {
    const user = await userSchema.find({ _id: req.params.id });
    if (user) {
      for (const x of req.body.product) {
        await userSchema.updateOne(
          { _id: req.params.id },
          { $push: { cart: x._id } }
        );
      }

      res.json({
        status: "success",
      });
    } else {
      res.sendStatus(401);
    }
  },
  showCart: async (req, res) => {
    const user = await userSchema.find({ _id: req.params.id }).populate("cart");

    if (user) {
      res.json(user[0].cart);
    } else {
      res.sendStatus(404);
    }
  },
  addToWishList: async (req, res) => {
    const user = await userSchema.find({ _id: req.params.id });
    if (user) {
      for (const x of req.body.product) {
        await userSchema.updateOne(
          { _id: req.params.id },
          { $push: { wishlist: x._id } }
        );
      }

      res.json({
        status: "success",
      });
    } else {
      res.sendStatus(401);
    }
  },
  showWishList: async (req, res) => {
    const user = await userSchema
      .find({ _id: req.params.id })
      .populate("wishlist");

    if (user) {
      res.json(user[0].wishlist);
    } else {
      res.sendStatus(404);
    }
  },
  deletewishListItems: async (req, res) => {
    const user = await userSchema.find({ _id: req.params.id });
    if (user) {
      await userSchema.updateOne(
        { _id: req.params.id },
        { $pull: { wishlist: req.body._id } }
      );
      res.json({ status: "success" });
    } else {
      res.sendStatus(404);
    }
  },
};
