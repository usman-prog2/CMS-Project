const express=require('express');
const router=express.Router();
const posts=require('../../models/postModel.js')

router.all('/*',(req,res,next)=>
{
    req.app.locals.layout='main';
    next();
})
    
router.get('/',(req,res)=>
{
    // req.session.usman='Usman Sarwar'
    // if(req.session.usman)
    // {
    //  console.log(`we found ${req.session.usman}`);
    // }
    posts.find({}).then((post)=>
    {
        res.render("home/index",{post:post}); 
    })
})

router.get('/post/:id',(req,res)=>
{
    posts.findOne({_id:req.params.id}).then((post)=>
    {
    res.render('home/post',{post:post})
    })
})
    
router.get('/about',(req,res)=>
    {
        res.render("home/about");
    })
router.get('/login',(req,res)=>
    {
        res.render("home/login");
    })    
    
router.get('/register',(req,res)=>
    {
        res.render("home/register");
    })

    module.exports=router;