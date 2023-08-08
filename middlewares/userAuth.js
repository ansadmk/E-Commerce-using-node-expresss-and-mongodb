const jwt = require("jsonwebtoken");
const auth =(req, res, next) => {
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
  }
module.exports=auth