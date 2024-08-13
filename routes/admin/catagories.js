const express=require('express');
const router=express.Router();
const category=require('../../models/categoryModel.js');
const Post=require('../../models/postModel.js');
const {userAuthenticated}=require('../../helpers/authentication-helper.js');


router.all('/*',userAuthenticated,(req,res,next)=>
{
  req.app.locals.layout='admin';
  next();
});


router.get('/',async (req,res)=>
{  
  
  // let post = await Post.findOne({_id: "66b0845b6a36ae3497a16e72"})
  // console.log("post", post)
  // category.findOne({ _id: req.params.id }).populate('posts').then((catagory)=> {
  //  catagory.posts.push(post)
  //  console.log(catagory.posts, "heloooooooooooooooooooooooooooooooooooooo")

  // })
  // res.send(JSON.stringify(obj))

  category.find({}).then((catagory)=>
  {
    Post.find({}).then(posts=>
    {
      res.render('admin/categories/category',{category:catagory,posts:posts});
    })
  })
});

// router.get('/',(req,res)=>
//   { 
//     Post.find({}).then(posts=>
//       {
//         res.render('admin/categories/category',{posts:posts});
//       })
//   });

router.post('/create',(req,res)=>
{
  req.body
  req.flash('Success_Message',`Category is created successfully`);
  
  let Category=new category(req.body);
    Category.save().then(()=>
      {
       res.redirect('/admin/categories');
      }).catch((err)=>
      {
        console.log(err);
      })

});

router.get('/edit/:id',(req,res)=>
  {
    category.findOne({_id:req.params.id}).then((category)=>
    {
    res.render('admin/categories/edit',{category:category});
    })
  });

router.put('/edit/:id',(req,res)=>
{
  const id=req.params.id;
  category.findByIdAndUpdate(id,{$set:req.body}).then((catagory)=>
  {
    req.flash('Success_Message',`Category is updated successfully`);
    res.redirect('/admin/categories');
  })
});  

router.delete('/:id',(req,res)=>
{
  category.deleteOne({_id:req.params.id}).then(()=>
  {
    req.flash('Success_Message',`Category is deleted successfully`);
    res.redirect('/admin/categories')
  })
})

module.exports=router;





{/* <div class="form-group">
    <label for="post">Posts</label><br>
    <select id="post" name="post" type="text" class="form-control">
        {{#each posts}}
        <option value="{{id}}">{{title}}</option>
        {{/each}}
    </select>
    <br>
    </div>  */}