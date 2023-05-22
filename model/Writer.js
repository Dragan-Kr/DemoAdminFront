const mongoose = require('mongoose');

const writerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'writer must have a name'],
       
        
      },
      lastName:{
        type:String,
        required:[true,'writer must have a lastname']
      },
   
    

      
      
});
module.exports = mongoose.model('Writer',writerSchema);