const handle=(err,req,res,next)=>{
    console.log(err.stack);
    res.status(500).send('Something broke!');
}
module.exports=handle