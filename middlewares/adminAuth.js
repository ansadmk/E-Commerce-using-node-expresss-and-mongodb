const jwt = require("jsonwebtoken");
const auth= (req, res, next) => {
    try {
      const auth = req.headers["authorization"];
      const token = auth && auth.split(" ")[1];
      if (token) {
        const { username, password } = jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET
        );
        if (username == "Admin" && password == "Admin") {
          next();
        } else {
          res.sendStatus(401);
        }
      } else {
        res.sendStatus(401);
      }  
    } catch (error) {
      next(error)
    }}
    module.exports=auth