const handle=(err,req,res,next)=>{
    
    res.status(500).json('Something broke!');
}
module.exports=handle