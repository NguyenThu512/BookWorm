const category_models = require('../models/category.model');
const cartModel = require('../models/cart.model');
const order_models = require('../models/order.model');

module.exports = function(app){
    app.use(async function (req,res,next)
    {
      res.locals.lcCategory = await category_models.All();
      res.locals.code = req.session.code;
      res.locals.forget = req.session.forget;
      res.locals.sell = req.session.sell;
      res.locals.account = req.session.account;

      next();
    });

    app.use(async function (req,res,next)
    {
      if(typeof(req.session.auth)==='undefined'){
        req.session.auth = false;
      }

      if (req.session.auth === false) {
        req.session.cart = [];
      }

      

      console.log(req.session.cart);
      res.locals.auth = req.session.auth;
      res.locals.authUser = req.session.authUser;
      res.locals.account = req.session.account;
      res.locals.cartSummary = cartModel.getNumberOfItems(req.session.cart);
      if (req.session.auth === true) {
        res.locals.confirmSell = await order_models.countSell0(req.session.authUser.userID);
      }
      next();
    });
  
}
