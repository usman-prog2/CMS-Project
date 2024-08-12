const express=require('express');
const app=express();
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const path=require('path');
const { engine } = require ('express-handlebars');
const methodOverride=require('method-override');
const {allowInsecurePrototypeAccess}=require('@handlebars/allow-prototype-access');
const Handlebars=require('handlebars');
const upload=require('express-fileupload');
const session=require('express-session');
const flash=require('connect-flash');
const {mongoDbUrl}=require('./config/database.js');
const passport=require('passport');

const port=9000||process.env.port;
app.use(express.static(path.join(__dirname,'/public')));

mongoose.connect(mongoDbUrl).then(()=>
{
    console.log('Connected')
}).catch((err)=>
{
    console.log(err);
})

const {select,generateDate,paginate} =require('./helpers/handlebars-helper.js');
app.engine('handlebars', engine({handlebars:allowInsecurePrototypeAccess(Handlebars),defaultLayout:'main', helpers:{Select:select,generateDate:generateDate,paginate:paginate}}));
app.set('view engine', 'handlebars');

app.use(upload());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(session({
    secret:'cmsProject',
    resave:true,
    saveUninitialized:true
}));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>
{
    res.locals.Success_Message=req.flash('Success_Message');
    res.locals.error_message=req.flash('error_message');
    res.locals.user=req.user;
    res.locals.error=req.flash('error');
    next();
})

const HomeRouter=require('./routes/home/homeRoutes');
const AdminRouter=require('./routes/admin/adminRoutes');
const PostRouter=require('./routes/admin/posts');
const CatagoriesRouter=require('./routes/admin/catagories');
const CommentsRouter=require('./routes/admin/comments');

const { handlebars } = require('hbs');
app.use(methodOverride('_method'));


app.use('/',HomeRouter);
app.use('/admin',AdminRouter);
app.use('/admin/posts',PostRouter);
app.use('/admin/categories',CatagoriesRouter);
app.use('/admin/comments',CommentsRouter);




app.listen(port,()=>
{
    console.log(`listening on the port ${port}`);
})