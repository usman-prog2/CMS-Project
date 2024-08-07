const express=require('express');
const router=express.Router();
const posts=require('../../models/postModel.js');
const Category=require('../../models/categoryModel.js');
const User=require('../../models/userModel.js');
const bcrypt=require('bcryptjs');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;


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
        Category.find({}).then(categories=>
        {
            res.render("home/index",{post:post,categories:categories}); 
        }
        )
    })
})

router.get('/post/:id',(req,res)=>
{
    posts.findOne({_id:req.params.id}).then((post)=>
    {
        Category.find({}).then(categories=>
            {
                res.render("home/post",{post:post,categories:categories}); 
            }
            )
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

passport.use(new LocalStrategy({usernameField:'email'},(email,password,done)=>
{
    User.findOne({email:email}).then(user=>
    {
        if(!user)  return done(null,false,{message:'user not found'})
        
        bcrypt.compare(password,user.password,(err,matched)=>
        {
            if(err) console.log(err);
            if(matched)
            {
                return done(null,user);
            }
            else
            {
              return done(null,false,{message:'email or password is incorrect'});
            }
        })
    }
    )
}));

// passport.serializeUser(function(user,done)
// {
//     done(null,user.id);
// })
// passport.deserializeUser(function(id,done)
// {
//    User.findById(id).then(user=>
//    {
//      done(user)
//    }).catch(err=>
//    {
//      done(err)
//    }
//    )
// });

passport.serializeUser(function(user, cb) {
    //   cb(null, { email:user.email , password: user.password });
    cb(null, user.id);
  });
  
passport.deserializeUser(function(user, cb) 
  {
    return cb(null, user);
  });
    
router.post('/login',(req,res,next)=>
 {
    passport.authenticate('local',{
        successRedirect:'/admin',
        failureRedirect:'/login',
        failureFlash:true
    })(req,res,next);
 }) 

router.get('/register',(req,res)=>
    {
        res.render("home/register");
    })
router.post('/register',(req,res)=>
    {
        let errors=[];

        if(!req.body.firstName)
        {
            errors.push({message:"Please enter firstName"});
        }

        if(!req.body.lastName)
        {
            errors.push({message:"Please enter lastName"});
        }

        if(!req.body.email)
        {
            errors.push({message:"Please enter email"});
        }

        if(!req.body.password)
        {
            errors.push({message:"Please enter Password"});
        }

        if(!req.body.passwordConfirm)
        {
            errors.push({message:"Please enter ConfirmPassword"});
        }

        if(req.body.password!==req.body.passwordConfirm)
        {
            errors.push({message:"Password and ConfirmPassword must be same"});
        }    

        if(errors.length>0)
        {
            res.render('home/register',{errors:errors,
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.email
            });
        }

        else
        {
            User.findOne({email:req.body.email}).then(user=>
            {
              if(!user)
             {
                const newUser=new User(req.body);
           

                bcrypt.genSalt(10,(err,salt)=>
                {
                    bcrypt.hash(newUser.password,salt,(err,hash)=>
                    {
                        newUser.password=hash;
                         newUser.save().then(user=>
                         {
                         req.flash('Success_Message',"You are Successfully Registerd, please Login")
                         res.redirect("/login");
                         }).catch((err)=>
                         {
                           res.send(err)
                         })
    
                    })
                })
              }
              else
              {
                req.flash('error_message','Email Alreday Exist,please login')
                res.redirect("/login");
              };
            })
            
           
        }
    })
    

    module.exports=router;