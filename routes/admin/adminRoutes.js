const express=require('express');
const router=express.Router();
const Post=require('../../models/postModel.js');
const faker=require('faker');
router.all('/*',(req,res,next)=>
{
  req.app.locals.layout='admin';
  next();
})


router.get('/',(req,res)=>
{
  res.render('admin/index');
})

router.post('/generate-fake-posts',(req,res)=>
{
  for(let i=0;i<=req.body.amount;i++)
  {
    let posts=new Post({
      title:faker.name.title(),
      status:'public',
      allowComments:faker.datatype.boolean(),
      description:faker.lorem.sentence()
    })

    posts.save();
  }
  res.redirect('/admin/posts');
   
})


module.exports=router;