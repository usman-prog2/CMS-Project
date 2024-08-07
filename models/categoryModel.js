const mongoose=require("mongoose");
const schema= mongoose.Schema;

const categorySchema=new schema(
    {
        posts:
        [{
          type:schema.Types.ObjectId,
          ref:'posts'
        }],

        name:
        {
            type:String,
            required:true
        }
    }
)

module.exports=mongoose.model('categories',categorySchema);