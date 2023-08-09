const Joi = require("joi")
const productvalidate=Joi.object({
    title:Joi.string().required(),
    description:Joi.string().required(),
    price:Joi.number().required(),
    image:Joi.string().required(),
    category:Joi.string().required()

})
const userValidate=Joi.object({
    username:Joi.string().required(),
    email:Joi.string(),
    password:Joi.string().required()
    

})
module.exports={productvalidate,userValidate}