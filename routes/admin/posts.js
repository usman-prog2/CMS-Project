const express=require('express');
const router=express.Router();
const posts=require("../../models/postModel.js");
//setting default layout
router.all('/*',(req,res,next)=>
{
    req.app.locals.layout='admin';
    next();
})

//displaying all posts
router.get('/',(req,res)=>
{
  posts.find({}).then((posts)=>
{
    res.render('admin/posts/allPosts',{Posts:posts});
})
})

//create post view rendring
router.get('/create',(req,res)=>
{
    res.render('admin/posts/create');
})

//edit
router.get('/edit/:id',(req,res)=>
{
    posts.findOne({_id:req.params.id}).then((post)=>
    {
    res.render('admin/posts/edit',{post:post});
    })
})

//creating and saving post in db 
router.post('/create',(req,res)=>
    {
      let allowComments=true;
      if(req.body.allowComments)
      {
        allowComments=true;
      }
      else
      {
        allowComments=false;
      }
      const newPost=new posts({ title:req.body.title,
        status:req.body.status,
        allowComments:allowComments,
        description:req.body.description});

      newPost.save().then(()=>
    {
        res.send("Post Saved");
    }).catch((err)=>
    {
        res.send('Post is not saved'+err);
    })
    })

 //updating
router.put('/edit/:id',(req,res)=> {
    posts.findOne({_id:req.params.id}).then((post)=>
    {
        if(req.body.allowComments)
        {
            allowComments=true;
        }
        else
        {
            allowComments=false;
        }

        post.title=req.body.title;
        post.status=req.body.status;
        post.allowComments=allowComments
        post.description=req.body.description;
        post.save().then(()=>
        {
            res.redirect('/admin/posts');
        })
    })
})

//deleting a post
router.delete('/:id',(req,res)=>
{
    posts.deleteOne({_id: req.params.id}).
    then(()=>
    {
        res.redirect('/admin/posts');
    })
})
module.exports=router;