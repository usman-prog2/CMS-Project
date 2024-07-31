const mongoose=require("mongoose");
const schema= mongoose.Schema;

const postSchema=new schema(
    {
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
            required:true
        },
        description:
        {
            type:String,
            required:true
        }
    }
)

module.exports=mongoose.model('post',postSchema);