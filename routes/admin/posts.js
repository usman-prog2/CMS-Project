const express=require('express');
const router=express.Router();
const posts=require("../../models/postModel.js");
const Category=require("../../models/categoryModel.js");
const {isEmpty}=require('../../helpers/uploadFile-helper.js');
const categoryModel = require('../../models/categoryModel.js');
const {userAuthenticated}=require('../../helpers/authentication-helper.js');

//setting default layout
router.all('/*',(req,res,next)=>
{
    req.app.locals.layout='admin';
    next();
})

//displaying all posts
router.get('/',(req,res)=>
{
  posts.find({})
  .populate('category')
  .then((posts)=>
{
    res.render('admin/posts/allPosts',{Posts:posts});
})
})

//create post view rendring
router.get('/create',(req,res)=>
{
   Category.find({}).then(categories=>
   {
    res.render('admin/posts/create',{categories:categories});
   })
})

//edit
router.get('/edit/:id',(req,res)=>
{
    posts.findOne({_id: req.params.id}).then((post)=>
    {
     Category.find({}).then(categories=>
     {
        res.render('admin/posts/edit',{post: post,categories:categories});
     }
     )
    })
})


//creating and saving post in db
router.post('/create',(req,res)=>
    {
        let errors=[];
        if(!req.body.title)
        {
            errors.push({message:"Please add title"});
        }

        if(!req.body.allowComments)
        {
            errors.push({message:"AllowComments are required"});
        }
        
        if(!req.body.description)
        {
            errors.push({message:"Please add description"});
        }

        if(errors.length>0)
        {
            res.render('admin/posts/create',{errors:errors})
        }
        else{
            let filename='';
            if(!isEmpty(req.files))
            {
              let file=req.files.file;
              filename=Date.now()+ "-" +file.name;
              file.mv("./public/uploads/" + filename,(err)=>
              {
                  if(err) console.log(err);
              })
            }
            
          //console.log(req.body);
          req.body.file=filename;
          const newPost=new posts(req.body);
          
          newPost.save().then((post)=>
        {   
            
            // console.log("test", post.populate('category'))
            // post.populate('category').then(p => {
            //     p.category.posts.push(post)
            //     console.log("cat", p.category);
            // })

           req.flash('Success_Message',`Post '${post.title}' is saved successfully`);
           res.redirect('/admin/posts');
        }).catch((err)=>
        {
            res.send('Post is not saved'+err);
        })
        }
       
     })

 //updating
router.put('/edit/:id',(req,res)=> {
    let filename='';
    if(!isEmpty(req.files))
    {
      let file=req.files.file;
      filename=Date.now()+ "-" +file.name;
      file.mv("./public/uploads/" + filename,(err)=>
      {
          if(err) console.log(err);
      })
    }
    req.body.file=filename;
    const id=req.params.id;
    posts.findByIdAndUpdate(id,{$set:req.body}).
    then(()=>
    {
       req.flash('Success_Message',`Post is updated successfully`);
       res.redirect('/admin/posts');
    }).catch(
    (err)=>
    {
        console.log(err); 
    })
})

//deleting a post
router.delete('/:id',(req,res)=>
{
    posts.deleteOne({_id: req.params.id}).populate('comments').
    then((post)=>
    {
        req.flash('Success_Message',`Post is deleted successfully`);
        res.redirect('/admin/posts');
    })
})
module.exports=router;