const mongoose=require('mongoose');
const emailValidator=require("email-validator")
const Schema=mongoose.Schema;

const userSchema=new Schema(
    {
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            validate:function(){
                return emailValidator.validate(this.email);
            }
        },
        password:{
            type:String,
            required:true,
            minlength:[8,'password must be of 8 characters']
        }
    }
)
module.exports=mongoose.model('users',userSchema);