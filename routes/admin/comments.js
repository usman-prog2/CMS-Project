const express=require('express');
const router=express.Router();
const Post=require('../../models/postModel.js');
const Comment=require('../../models/commentModel.js');

router.all('/*',(req,res,next)=>
{
    req.app.locals.layout='admin';
    next();
})

router.get('/',(req,res)=>
{
    Comment.find({}).populate('user').then(comments=>
    {
        res.render('admin/comments/allComments',{comments:comments});
    }
    )
})

 router.post('/',(req,res)=>
{
   Post.findOne({_id:req.body.id}).then((post)=>
{
    const newComment=new Comment({
        user:req.user._id,
        body:req.body.body
    })

    post.comments.push(newComment);
    post.save().then(savedPost=>
    {
        newComment.save().then(()=>
        {
            res.redirect(`/post/${post.id}`);
        })
    }
    )
})
})

router.delete('/:id',(req,res)=>
{
    Comment.deleteOne({_id:req.params.id}).then(()=>
    {
        res.redirect('/admin/comments');
    })
})
module.exports=router;