const express = require('express');
const product_models = require('../models/product.model');
const order_models = require('../models/order.model');
const auth = require('../middlewares/auth.mdw');

const router = express.Router();

router.get('/',auth, async function(req,res,next)
{
    req.session.account = false;
    res.locals.account=req.session.account;
  
    req.session.sell = true;
    res.locals.sell = req.session.sell;


    console.log(req.session.authUser.userID);
    const idUser = req.session.authUser.userID;
    const list = await product_models.AllByUser(idUser);
    console.log(list.length);
    res.render('product/viewSell', {
        products: list,
        empty: list.length === 0
    });
})

router.get('/add',auth,function(req,res)
{
    res.render('product/add');
})

router.post('/add', async function(req,res)
{
    console.log(req.body);
    const book = {
        bookName: req.body.bookName,
        bookPrice: req.body.bookPrice,
        catID: req.body.catID,
        sellerID: req.session.authUser.userID,
        quantity: req.body.quantity,
        bookDescription: req.body.bookDescription
    }
    await product_models.add(book);
    res.redirect('/sell');
})

router.get('/edit',auth, async function(req,res)
{
    const id = req.query.id;
    const book = await product_models.single(id);
    if (book===null){
        return res.redirect('/sell');
    }
    res.render('product/edit',{
        book
    });
})

router.post('/del',auth, async function(req,res)
{
    await product_models.del(req.body.bookID);
    if(req.session.authUser.permission==1)
    {
        res.redirect('/home');
    }
    res.redirect('/sell');
})

router.post('/save',auth, async function(req,res)
{
    await product_models.update(req.body);
    res.redirect('/sell');
})

router.get('/viewConfirm',auth, async function(req,res,next)
{
    const list = await order_models.AllBySellStatus(req.session.authUser.userID,0);

    res.render('product/confirmSell', {
        products: list,
        empty: list.length === 0
    });
})

router.get('/detailconfirm',auth, async function(req,res,next)
{
    const orderID = req.query.orderid;
    const list = await order_models.AllBySellStatus(req.session.authUser.userID,0);
    
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

    res.render('product/detailSellConfirm', {
        order: list[i]
    });
})

router.get('/confirm',auth, async function(req,res)
{
    const orderID = req.query.orderid;
    const entity = {orderID, status: 1};
    const list = await order_models.OrderBuyQuantity(orderID);
    list[0].quantity-=list[0].buy;
    delete(list[0].buy);
    await product_models.update(list[0]);
    await order_models.updateStatus(entity);

    
    res.redirect('/sell/viewConfirm');
})

router.get('/deliver',auth, async function(req,res,next)
{
    const list = await order_models.AllBySellStatus(req.session.authUser.userID,1);
    
    res.render('product/deliverSell', {
        products: list,
        empty: list.length === 0
    });
})

router.get('/detaildeliver',auth, async function(req,res,next)
{
    const orderID = req.query.orderid;
    const list = await order_models.AllBySellStatus(req.session.authUser.userID,1);
    
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

    res.render('product/detailSellDeliver', {
        order: list[i]
    });
})

router.get('/success',auth, async function(req,res,next)
{
    const list = await order_models.AllBySellStatus(req.session.authUser.userID,2);

    res.render('product/successSell', {
        products: list,
        empty: list.length === 0
    });
})

router.get('/detailsuccess',auth, async function(req,res,next)
{
    const orderID = req.query.orderid;
    const list = await order_models.AllBySellStatus(req.session.authUser.userID,2);
    
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

    res.render('product/detailSellSuccess', {
        order: list[i]
    });
})

module.exports = router