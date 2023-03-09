const express = require('express');
const moment = require('moment');
const cartModel = require('../models/cart.model');
const productModel = require('../models/product.model');
const orderModel = require('../models/order.model');
const detailModel = require('../models/detail.model');
const auth = require('../middlewares/auth.mdw');

const router = express.Router();

router.get('/', auth, async function (req, res) {
  const items = [];
  let total=0;
  for (const ci of req.session.cart) {
    const book = await productModel.single(ci.id);
    total+=book.bookPrice * ci.quantity;
    items.push({
      book,
      quantity: ci.quantity,
      amount: book.bookPrice * ci.quantity,
      increase: book.quantity > ci.quantity,
      decrease: ci.quantity > 1
    })
  }

  res.render('cart/view', {
    layout: false,
    items,
    empty: items.length === 0,
    total
  });
})

router.post('/add',auth, async function (req, res) {
  console.log(req.body);
  const item = {
    id: +req.body.id,
    quantity: +req.body.quantity
  }


  cartModel.add(req.session.cart, item);
  res.redirect(req.headers.referer);
})

router.post('/increase', async function (req, res) {
  console.log(req.body);
  const item = {
    id: +req.body.id1,
    quantity: +req.body.quantity
  }

  cartModel.add(req.session.cart, item);
  res.redirect(req.headers.referer);
})

router.post('/decrease', async function (req, res) {
  console.log(req.body);
  const item = {
    id: +req.body.id2,
    quantity: -req.body.quantity
  }
  console.log(item);
  cartModel.add(req.session.cart, item);
  res.redirect(req.headers.referer);
})

router.post('/remove', async function (req, res) {
  console.log(req.body);
  cartModel.remove(req.session.cart, +req.body.id);
  res.redirect(req.headers.referer);
})

router.get('/confirmCheckout', auth, async function (req, res) {
  const items = [];
  let total=0;
  for (const ci of req.session.cart) {
    const book = await productModel.single(ci.id);
    total+=book.bookPrice * ci.quantity;
    items.push({
      book,
      quantity: ci.quantity,
      amount: book.bookPrice * ci.quantity,
    })
  }
  
  res.render('cart/confirm', {
    layout: false,
    items,
    total
  });
})

router.post('/checkout', async function (req, res)
{
  for (const ci of req.session.cart) {
    const book = await productModel.single(ci.id);

    const order = {
      buyerID: req.session.authUser.userID,
      bookID: book.bookID,
      total: book.bookPrice * ci.quantity,
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      price: book.bookPrice,
      quantity: ci.quantity,
      status: 0
    }
    await orderModel.add(order);
  }

  req.session.cart = [];
  res.redirect('/home');
})

module.exports = router;
