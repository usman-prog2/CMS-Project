const express=require('express');
const router=express.Router();
const category=require('../../models/categoryModel.js');

router.all('/*',(req,res,next)=>
{
  req.app.locals.layout='admin';
  next();
});


router.get('/',(req,res)=>
{ 
  category.find({}).then((catagory)=>
  {
    res.render('admin/categories/category',{category:catagory});
  })
});

router.post('/create',(req,res)=>
{
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
    res.redirect('/admin/categories');
  })
});  

router.delete('/:id',(req,res)=>
{
  category.deleteOne({_id:req.params.id}).then(()=>
  {
    res.redirect('/admin/categories')
  })
})

module.exports=router;