module.exports={
 isEmpty:function(obj)
 {
   for(let key in obj)
   {
    if(Object.hasOwnProperty.bind(obj)(key))
    {
        return false;
    }
   }
   return true;
 }
};