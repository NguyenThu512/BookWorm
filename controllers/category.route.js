const express = require('express');
const category_models = require('../models/category.model');
const admin = require('../middlewares/admin.mdw');
const product_models = require('../models/product.model');

const router = express.Router();

router.get('/', admin, async function(req,res)
{
    req.session.account = false;
    res.locals.account=req.session.account;
  
    req.session.sell = true;
    res.locals.sell = req.session.sell;
    
    const list = await category_models.All();
    console.log(list.length);
    res.render('category/view', {
        categories: list,
        empty: list.length === 0
    });
})


router.get('/add',admin, function(req,res)
{
    res.render('category/add');
})

router.post('/add', async function(req,res)
{
    console.log(req.body);
    await category_models.add(req.body);
    res.redirect('/category');
})

router.get('/edit',admin, async function(req,res)
{
    const id = req.query.id;
    const category = await category_models.single(id);
    if (category===null){
        return res.redirect('/category');
    }
    res.render('category/edit',{
        category
    });
})

router.post('/del', async function(req,res)
{
    const total = await product_models.countByCat(idCat);
    if(total==0)
    {
        await category_models.del(req.body.catID);
    }

    res.redirect('/category');
})

router.post('/save', async function(req,res)
{
    await category_models.update(req.body);
    res.redirect('/category');
})

module.exports = router