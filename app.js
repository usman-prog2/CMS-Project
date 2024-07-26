const express=require('express');
const app=express();
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const path=require('path');
const { engine } = require ('express-handlebars');
const port=9000||process.env.port;
app.use(express.static(path.join(__dirname,'public')));

app.engine('handlebars', engine({defaultLayout:'main'}));
app.set('view engine', 'handlebars');
const Router=require('./routes/home/homeRoutes');
const AdminRouter=require('./routes/admin/adminRoutes');
app.use('/',Router);
app.use('/admin',AdminRouter);


app.listen(port,()=>
{
    console.log(`listening on the port ${port}`);
})