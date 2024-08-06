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
const {select,generateDate} =require('./helpers/handlebars-helper.js');
const session=require('express-session');
const flash=require('connect-flash');

const port=5000||process.env.port;
app.use(express.static(path.join(__dirname,'/public')));

mongoose.connect("mongodb://localhost:27017/cms").then(()=>
{
    console.log('Connected')
}).catch((err)=>
{
    console.log(err);
})

app.engine('handlebars', engine({handlebars:allowInsecurePrototypeAccess(Handlebars),defaultLayout:'main', helpers:{Select:select,generateDate:generateDate}}));
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
app.use((req,res,next)=>
{
    res.locals.Success_Message=req.flash('Success_Message');
    next();
})

const HomeRouter=require('./routes/home/homeRoutes');
const AdminRouter=require('./routes/admin/adminRoutes');
const PostRouter=require('./routes/admin/posts');
const CatagoriesRouter=require('./routes/admin/catagories');

const { handlebars } = require('hbs');
app.use(methodOverride('_method'));


app.use('/',HomeRouter);
app.use('/admin',AdminRouter);
app.use('/admin/posts',PostRouter);
app.use('/admin/categories',CatagoriesRouter);




app.listen(port,()=>
{
    console.log(`listening on the port ${port}`);
})