const Joi = require("joi")
const productvalidate=Joi.object({
    title:Joi.string(),
    description:Joi.string(),
    price:Joi.number(),
    image:Joi.string(),
    category:Joi.string()

})
const userValidate=Joi.object({
    username:Joi.string(),
    email:Joi.string(),
    password:Joi.string()
    

})
module.exports={productvalidate,userValidate}