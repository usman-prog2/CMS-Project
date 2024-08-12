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
    Comment.find({user:req.user._id}).populate('user').then(comments=>
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
            req.flash('Success_Message','Your comment will reviewed and then approved by admin');
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
        Post.findOneAndUpdate({comments:req.params.id},{$pull:{comments:req.params.id}}).then(()=>
        {
            res.redirect('/admin/comments');    
        })
    })
})

router.post('/approvecomments',(req,res)=>
{
    Comment.findByIdAndUpdate(req.body.id,{$set:{approveComment:req.body.approveComment}}).then((result)=>
    {
        res.send(result);
    }).catch((err)=>
    {
        res.send(err);
    })
})
module.exports=router;