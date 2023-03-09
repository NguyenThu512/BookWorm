const express = require('express');
const product_models = require('../models/product.model');
const order_models = require('../models/order.model');
const { paginate } = require('../config/default.json');
const auth = require('../middlewares/auth.mdw');

const router = express.Router();

router.get('/byCat/:id', async function(req,res,next)
{
    req.session.account=false;
    res.locals.account=req.session.account;
  
    req.session.sell = false;
    res.locals.sell = req.session.sell;

    const idCat = req.params.id;

    const page = req.query.page || 1;
  if (page < 1) page = 1;

  const total = await product_models.countByCat(idCat);
  let nPages = Math.floor(total / paginate.limit);
  if (total % paginate.limit > 0) nPages++;

  const page_numbers = [];
  var CurrentPage = 0;
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page
    });
    if  ((i === +page) === true)
        CurrentPage=i;
  }
    const offset = (page - 1) * paginate.limit;
    const list = await product_models.pageByCat(idCat, offset);
    console.log(CurrentPage + 1);
    console.log(CurrentPage - 1);
    res.render('product/byCat', {
        products: list,
        page_numbers,
        empty: list.length === 0,
        n: CurrentPage===nPages,
        p: CurrentPage===1,
        nextPage: CurrentPage + 1,
        prePage: CurrentPage - 1
    });
})

router.get('/detail/:id', async function(req,res,next)
{
    const idBook = req.params.id;

    const book = await product_models.single(idBook);
    if (book==null){
        return res.redirect('/');
    }
    if(req.session.auth===true && req.session.authUser.permission==1)
        book.permission = 1;
    else
        book.permission=0;
    res.render('product/detail', {
        layout: false,
        book,

    });
})

router.post('/search', async function(req,res)
{
    req.session.account=false;
    res.locals.account=req.session.account;
    req.session.sell = false;
    res.locals.sell = req.session.sell;
    const find = req.body.search;

    const list = await product_models.searchBook(find);
    console.log(list.length);
    res.render('product/search', {
        products: list,
        empty: list.length === 0
    });
}) 

router.get('/viewConfirm',auth, async function(req,res,next)
{
    const list = await order_models.AllByBuyStatus(req.session.authUser.userID,0);

    res.render('product/confirmBuy', {
        products: list,
        empty: list.length === 0
    });
})

router.get('/detailconfirm',auth, async function(req,res,next)
{
    const orderID = req.query.orderid;
    const list = await order_models.AllByBuyStatus(req.session.authUser.userID,0);
    var i;
    for(i=list.length-1;i>=0;i--)
    {
        console.log(list[i].orderID);
        console.log(orderID);
        console.log(list[i].orderID==orderID);
        if(list[i].orderID==orderID)
        {
            console.log(i);
            break;
        }
    };

    res.render('product/detailBuyConfirm', {
        order: list[i]
    });
})

router.get('/cancel',auth, async function(req,res)
{
    const orderID = req.query.orderid;
    await order_models.delOrder(orderID);
    res.redirect('/buy/viewConfirm');
})

router.get('/deliver',auth, async function(req,res,next)
{
    const list = await order_models.AllByBuyStatus(req.session.authUser.userID,1);
    res.render('product/deliverBuy', {
        products: list,
        empty: list.length === 0
    });
})

router.get('/detaildeliver',auth, async function(req,res,next)
{
    const orderID = req.query.orderid;
    const list = await order_models.AllByBuyStatus(req.session.authUser.userID,1);
    var i;
    for(i=list.length-1;i>=0;i--)
    {
        console.log(list[i].orderID);
        console.log(orderID);
        console.log(list[i].orderID==orderID);
        if(list[i].orderID==orderID)
        {
            console.log(i);
            break;
        }
    };

    res.render('product/detailBuyDeliver', {
        order: list[i]
    });
})

router.get('/receive',auth, async function(req,res)
{
    const orderID = req.query.orderid;
    const entity = {orderID, status: 2};
    await order_models.updateStatus(entity);
    res.redirect('/buy/deliver');
})

router.get('/success',auth, async function(req,res,next)
{
    const list = await order_models.AllByBuyStatus(req.session.authUser.userID,2);
    res.render('product/successBuy', {
        products: list,
        empty: list.length === 0
    });
})

router.get('/detailsuccess',auth, async function(req,res,next)
{
    const orderID = req.query.orderid;
    const list = await order_models.AllByBuyStatus(req.session.authUser.userID,2);
    console.log(list);
    var i;
    for(i=list.length-1;i>=0;i--)
    {
        console.log(list[i].orderID);
        console.log(orderID);
        console.log(list[i].orderID==orderID);
        if(list[i].orderID==orderID)
        {
            console.log(i);
            break;
        }
    };
    console.log(list[i]);
    res.render('product/detailBuySuccess', {
        order: list[i]
    });
})

router.get('/love',auth, async function(req,res,next)
{
    res.render('product/love');
})

module.exports = router