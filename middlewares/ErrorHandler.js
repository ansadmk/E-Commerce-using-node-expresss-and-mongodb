function handle(middlewares) {
  if (middlewares) {
    return async (req, res,next) => {
      try {
        await middlewares(req,res,next);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
  }
}
module.exports = handle;
 