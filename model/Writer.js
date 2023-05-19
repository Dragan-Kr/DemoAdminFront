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
    //   email:{
    //     type:String,
    //     required:[true,'Please provide email'],
    //     match: [
    //         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    //         'Please provide a valid email',
    //       ],
    //     unique: true
        
    // },
    // password:{
    //     type:String,
    //     required:[true,'Please provide password'],
    //     minlength:6
      
    // },


      // ,role:{
      //   type:String
      // }
      
});
module.exports = mongoose.model('Writer',writerSchema);