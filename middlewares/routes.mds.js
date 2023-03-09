//const exphbs = require('express-handlebars');
const express = require('express');
const auth = require('./auth.mdw');
const product_models = require('../models/product.model');

module.exports = function(app){



  app.get('/home', async function(req,res){

    req.session.account=false;
    res.locals.account=req.session.account;
    req.session.sell = false;
    res.locals.sell = req.session.sell;

    const best = await product_models.bestSell(8,0);
    const newBook = await product_models.newSell(8,0);
    const common = await product_models.commonSell(8,0);
    const low = await product_models.lowSell(8,0);
    const high = await product_models.highSell(8,0);


    for(i=0;i<newBook.length;i++){
      if(i==0)
      {
        newBook[i].active=true;
      }
      else{
        newBook[i].active=false;
      }
      newBook[i].stt=i+1;
    }
    /*if(req.session.auth===true)
    {
      res.render('product/home');
    }
    else{
      res.redirect('/');
    }*/
    res.render('product/home',{
      best, 
      newBook,
      common,
      low,
      high
    });
  });
    
  
  app.use('/cart', auth, require('../controllers/cart.route'));
  //app.use('/demo/', require('../controllers/demo.route'));  
  app.use('/', require('../controllers/user.route'));
    app.use('/category', require('../controllers/category.route'));
    
    
    app.use('/sell', auth, require('../controllers/product-sell.route'));
    

    app.use('/buy', require('../controllers/product-buy.route'));
    
    app.get('/err', function(req, res){
      throw new Error('Error!');
    })
    
    app.use(express.static(__dirname + '/BookWorm'));
    app.use(function(req,res){
      res.render('404',{layout: false});
    });
}