const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'author must hava a name'],
        unique:true
        
      }

});

module.exports = mongoose.model('Category',categorySchema);