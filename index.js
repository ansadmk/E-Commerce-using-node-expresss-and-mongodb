require("dotenv").config();
const express=require('express')
const bodyparser=require('body-parser')
const userrouter=require('./Views/user')
const adminrouter=require('./Views/admin')
const app=express()
const mongoose=require('mongoose')
mongoose.connect(process.env.DATABASE_ADDRESS);
app.use(bodyparser.json()) 
app.use('/api/users',userrouter)
app.use('/api/admin',adminrouter)
app.listen(3000)
