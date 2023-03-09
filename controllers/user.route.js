const express = require('express');
const bcrypt = require('bcryptjs');
const user_models = require('../models/user.model');
const auth = require('../middlewares/auth.mdw');
const admin = require('../middlewares/admin.mdw');

const router = express.Router();

router.get('/', function(req,res)
{
    res.render('user/login', {layout: false});
})

router.post('/',async function(req,res)
{
    console.log(req.body);
    const user = await user_models.singleByUserName(req.body.username);
    if(user===null){
        return res.render('user/login', {layout: false, err_message: 'username không tồn tại'});
    }

    const ret = bcrypt.compareSync(req.body.pw,user.password);
    if(ret===false){
        return res.render('user/login', {layout: false, err_message: 'sai mật khẩu'});
    }

    req.session.auth = true;
    req.session.authUser = user;
    
    console.log(req.session.auth);
    console.log(req.session.authUser);
    const url = '/home' || req.session.retUrl;
    res.redirect(url);
})

router.get('/signup',async function(req,res, next)
{
    res.render('user/signup', {layout: false})
})

router.post('/signup',async function(req,res, next)
{

    const hash = bcrypt.hashSync(req.body.pwd, 10);
    console.log(req.body.birth);
    const new_user = {
        userName: req.body.username,
        password: hash,
        fullName: req.body.name,
        dob: req.body.birth,
        gender: req.body.sex,
        phoneNumber: req.body.phone,
        email: req.body.username,
        address: req.body.location,
        permission: 0
    }
    await user_models.add(new_user);
    res.redirect('/');
})

router.get('/is-available', async function(req,res)
{
    const username = req.query.user;
    const user = await user_models.singleByUserName(username);
    if(user ===null){
        return res.json(true);
    }

    res.json(false);
})

router.get('/profile', auth, function (req, res, next) {
  req.session.account = true;
  res.locals.account=req.session.account;
  
  req.session.sell = false;
  res.locals.sell = req.session.sell;

    res.render('user/profile', {
        user: req.session.authUser
    });
  })

router.post('/logout', auth, function (req, res) {
    req.session.auth = false;
    req.session.authUser = null;
    req.session.retUrl = null;
    req.session.cart = [];
    console.log(req.session.auth);
    const url = req.headers.referer || '/';

    res.redirect(url);
  })

router.get('/forgetPass', function(req,res)
  {
    res.render('user/inputUserName', {layout: false});
  }) 

router.post('/forgetPass', async function(req,res)
  {
    console.log(req.body);
    req.session.forget = await user_models.singleByUserName(req.body.username);

    res.redirect('/confirm');
  }) 

router.get('/confirm',async function(req, res, next)
  {
    var code = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for (var i = 0; i < 6; i++)
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    
    req.session.code = code;

    console.log(req.session.code);
    res.render('user/confirmPhone', {
        layout: false,
        phone: req.session.forget.phoneNumber
    })
  })
  
router.post('/confirm',async function(req,res, next)
  {
    console.log(req.body);
    console.log(req.session.code);
    if (req.session.code===req.body.code)
            res.redirect('/changePass');
    else
      res.render('user/confirmPhone', {layout: false})
  })

router.get('/changePass', function(req,res)
  {
      res.render('user/forgetPass', {
          layout: false,
    });
  }) 

router.post('/changePass', async function(req,res)
  {
    const hash = bcrypt.hashSync(req.body.pwd, 10);  
    req.session.forget.password = hash;
    const entity = {
        userID: req.session.forget.userID,
        password: hash
    }
    await user_models.update(entity);
    res.redirect('/');
    
  }) 

router.post('/save', async function(req,res)
  {
    //console.log(req.body);  
    await user_models.update(req.body);
    const user = await user_models.singleByUserName(req.body.userName);
    req.session.authUser = user;
    res.locals.authUser=req.session.authUser;
    //console.log(req.session.authUser);
    res.redirect('/profile');
  }) 

router.get('/confirmPass', auth, function(req,res)
  {
    res.render('user/inputPass');
  }) 

router.post('/confirmPass', function(req,res)
  {
    const ret = bcrypt.compareSync(req.body.pass,req.session.authUser.password);
    if(ret===false){
        return res.render('user/inputPass', {err_message: 'sai mật khẩu'});
    }
    else{
      res.redirect('/account/changePass');
    }

  })

  router.get('/account/changePass', auth, function(req,res)
  {
      res.render('user/changePass');
  }) 

router.post('/account/changePass', auth, async function(req,res)
  {
    const hash = bcrypt.hashSync(req.body.pwd, 10);  
    const entity = {
        userID: req.session.authUser.userID,
        password: hash
    }

    await user_models.update(entity);

    req.session.auth = false;
    req.session.authUser = null;
    req.session.retUrl = null;
    req.session.cart = [];
    res.redirect('/');
    
  }) 

router.get('/userAcc', admin, function(req,res,next)
{
    res.render('user/manage');
})

module.exports = router