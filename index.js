const express=require('express')
const bodyparser=require('body-parser')
const userrouter=require('./Views/user')
const adminrouter=require('./Views/admin')
const app=express()
const ErrorHandler=require('./ErrorHandler')
const mongoose=require('mongoose')
mongoose.connect("mongodb://localhost/E-commerce");
app.use(ErrorHandler)
app.use(bodyparser.json()) 
app.use('/api/users',userrouter)
app.use('/api/admin',adminrouter)
app.listen(3000)
