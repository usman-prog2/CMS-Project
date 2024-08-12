const express=require('express');
const router=express.Router();
const Post=require('../../models/postModel.js');
const Category=require('../../models/categoryModel.js');
const faker=require('faker');
const Comment=require('../../models/commentModel.js');
const {userAuthenticated}=require('../../helpers/authentication-helper.js');


router.all('/*',(req,res,next)=>
{
  req.app.locals.layout='admin';
  next();
})


router.get('/',(req,res)=>
{
  Post.countDocuments({}).then(Count=>
  {
    Category.countDocuments({}).then(Category=>
    {
      Comment.countDocuments({}).then(Comment=>
      {
        res.render('admin/index',{count:Count,category:Category,comment:Comment});
      }
      )
    }
    )
  }
  )
})

router.post('/generate-fake-posts',(req,res)=>
{
  for(let i=0;i<=req.body.amount;i++)
  {
    let posts=new Post({
      user:req.user._id,
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