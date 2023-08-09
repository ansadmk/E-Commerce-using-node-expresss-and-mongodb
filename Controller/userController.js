const userSchema = require("../Models/UserSchema");
const productSchema = require("../Models/ProductSchema");
const jwt = require("jsonwebtoken");
const {productvalidate,userValidate}=require('../Models/validate')
require("dotenv").config();
var temp;

module.exports = {
  register: async (req, res,next) => {
    const {error,value}=userValidate.validate(req.body)
    const { username, password,email } = value;
    if (error) {
      res.status(400).json(error.details[0].message)
    }else{
     
      await userSchema.create({
        username: username,
        email: email,
        password: password,
      });
      res.json({ status: "success" });
    }
  },
  login: async (req, res,next) => {
    const {error,value}=userValidate.validate(req.body)
    const { username, password } = value;
    if (error) {
      res.status(400).json(error.details[0].message)
    }else{
    
      
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
    }
  },
  
  ViewProducts: async (req, res,next) => {
    
      
      const foundProducts = await productSchema.find();
  
      if (foundProducts) {
        res.json(foundProducts);
      } else {
        res.json("Notfound");
        res.sendStatus(204);
      }
    
  },
  ViewProductsByCatagory: async (req, res,next) => {
    
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
  ViewProductById: async (req, res,next) => {
    
      const prod = await productSchema.findById(req.params.id);
        if (prod) {
          
          res.json(prod);
        } else {
          res.sendStatus(404)
        }
    
  },
  addToCart: async (req, res,next) => {
    
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
  showCart: async (req, res,next) => {
    
      const user = await userSchema.find({ _id: req.params.id }).populate("cart");
  
      if (user) {
        res.json(user[0].cart);
      } else {
        res.sendStatus(404);
      }
    
  },
  addToWishList: async (req, res,next) => {
    
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
  showWishList: async (req, res,next) => {
    
      const user = await userSchema
        .find({ _id: req.params.id })
        .populate("wishlist");
  
      if (user) {
        res.json(user[0].wishlist);
      } else {
        res.sendStatus(404);
      }
    
  },
  deletewishListItems: async (req, res,next) => {
    
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
  stripe:async (req,res,next)=>{
    
      const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)
      const user=await userSchema.find({_id:res.token.id}).populate('cart') 
      const cartitems= user[0].cart.map((a)=>{
        return {
          price_data: {
          currency: 'usd',
          product_data: {
            name: a.title,
            description:a.description,
          
          },
          unit_amount: a.price*100,
        },
        quantity: 1,
    }})
      if (cartitems) {
        
        const session = await stripe.checkout.sessions.create({
          line_items: cartitems,
          mode: 'payment',
          success_url: `${process.env.LOCAL_ADDRESS}/api/users/purchaseSuccess`,
          cancel_url: `${process.env.LOCAL_ADDRESS}/api/users/purchaseCancel`,
        });
        temp={cartproducts:user[0].cart,session:session,id:res.token.id}
        
        res.redirect(200,session.url);
        console.log(session);
        
      } else {
        res.json({Failed:"Cart empty"})
      }
    
    
  },
  success:async (req,res,next)=>{
    if(temp){
    await userSchema.updateOne({_id:temp.id},{$push:{orders:{
     products: temp.cartproducts,
     date: new Date(),
     order_id: Math.random(),
     payment_id: temp.session.id,
     totalAmount:temp.session.amount_total / 100,     
    }}})
   res.json({
     products: temp.cartproducts,
     date: new Date(),
     totalAmount:temp.session.amount_total / 100,
     payment_id: temp.session.id,   
     userId:temp.id  
    })
  }
    
  },
  cancel:async (req,res,next)=>{
    
      res.json({status:"failed"})
    
  }

};
