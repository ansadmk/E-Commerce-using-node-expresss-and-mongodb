const userSchema = require("../Models/UserSchema");
const productSchema = require("../Models/ProductSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  register: async (req, res,next) => {
    try {
      const { username, password, email } = req.body;
      await userSchema.create({
        username: username,
        email: email,
        password: password,
      });
      res.json({ status: "success" });
    } catch (error) {
      next(error)
    }
  },
  login: async (req, res,next) => {

    try {
      const { username, password } = req.body;
      const user = await userSchema.find({
        username: username,
        password: password,
      });
      const userdetails = {
        id:user[0]._id
      };
      const token = jwt.sign(userdetails, process.env.ACCESS_TOKEN_SECRET);
      if (token) {
        res.json({
          jwt_token: token,
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
        const verify = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (verify) {
          res.token=verify
          next();
        }
      } else {
        res.sendStatus(401);
      }
    } catch (error) {
      next(error)
    }
  },
  ViewProducts: async (req, res,next) => {
    try {
      
      const foundProducts = await productSchema.find();
  
      if (foundProducts) {
        res.json(foundProducts);
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
        res.json(foundProducts);
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
          
          res.json(prod);
        } else {
          res.sendStatus(404)
        }
    } catch (error) {
      next(error)
    }
  },
  addToCart: async (req, res,next) => {
    try {
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
    } catch (error) {
      next(error)
    }
  },
  showCart: async (req, res,next) => {
    try {
      const user = await userSchema.find({ _id: req.params.id }).populate("cart");
  
      if (user) {
        res.json(user[0].cart);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error)
    }
  },
  addToWishList: async (req, res,next) => {
    try {
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
    } catch (error) {
      next(error)
    }
  },
  showWishList: async (req, res,next) => {
    try {
      const user = await userSchema
        .find({ _id: req.params.id })
        .populate("wishlist");
  
      if (user) {
        res.json(user[0].wishlist);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error)
    }
  },
  deletewishListItems: async (req, res,next) => {
    try {
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
    } catch (error) {
      next(error)
    }
  },
  stripe:async (req,res,next)=>{
    try {
      const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)
      const user=await userSchema.find({_id:res.token.id}).populate('cart') 
      const cartitems= user[0].cart.map((a)=>{
        return {price_data: {
          currency: 'usd',
          product_data: {
            name: a.title,
            description:a.description,
          
          },
          unit_amount: a.price*100,
        },
        quantity: 1,
    }})
      
      const session = await stripe.checkout.sessions.create({
        line_items: cartitems,
        mode: 'payment',
        success_url: `http://localhost:3000/api/users/purchaseSuccess`,
        cancel_url: `http://localhost:3000/api/users/purchaseCancel`,
      });
      console.log(session);
      res.json({url:session.url});
      
    } catch (error) {
      next(error)
    }
    
  },
  success:async (req,res,next)=>{
    try {
      res.json({status:JSON.stringify(req.query.data)})
    } catch (error) {
      next(error)
    }
  },
  cancel:async (req,res,next)=>{
    try {
      res.json({status:"failed"})
    } catch (error) {
      next(error)
    }
  }

};
