const mongoose=require('mongoose');
const schema=mongoose.Schema;

const commentSchema=new schema({
  
    user:{
        type:schema.Types.ObjectId,
        ref:'users'
    },
    body:{
        type:String,
        required:true
    },
    approveComment:
    {
      type:Boolean
    },
    date:{
        type:Date,
        default:Date.now()
    }

},
{
    strictPopulate: false
} );

module.exports=mongoose.model('comments',commentSchema);