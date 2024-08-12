const mongoose=require("mongoose");
const category=require('./categoryModel.js');
const schema= mongoose.Schema;

const postSchema=new schema(
    {
        category:
        {
           type:schema.Types.ObjectId,
           ref:'categories'
        },

        title:
        {
            type:String,
            required:true
        },
        status:
        {
            type:String,
            default:'public'
        },
        allowComments:
        {
            type:Boolean,
            default:false
        },
        description:
        {
            type:String,
            required:true
        },
        file:
        {
            type:String
        },
        date:
        {
            type:Date,
            default:Date.now()
        },
       
        user:{
            type:schema.Types.ObjectId,
            ref:'users'
        },
        comments:[{
            type:schema.Types.ObjectId,
            ref:'comments'
        }]   
    }
)
postSchema.pre('save', async function(next)
  {
   if (this.isNew)
   { try {
    let catagory = await category.findById(this.category);
     if(catagory) {
       catagory.posts.push(this._id);
       await catagory.save();
  }
  else {
   console.warn('Category not found');
  }
  } catch (error) { next(error); // Pass any errors to the next middleware or error handler
  }
  } next();
});

 //postSchema.plugin(URLSlugs('title',{field:'slug'}));

module.exports=mongoose.model('posts',postSchema);