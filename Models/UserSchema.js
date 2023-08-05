const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
      username:String,
      email:String,
      password:String,
      cart:[{type:mongoose.SchemaTypes.ObjectId ,ref:'productlists'}],
      wishlist:[{type:mongoose.SchemaTypes.ObjectId ,ref:'productlists'}],
      orders:[]

})
module.exports=mongoose.model("usersLists",userSchema)