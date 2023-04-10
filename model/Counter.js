const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({

index:{
    type:String
},
seq:{
    type:Number
}


});


module.exports = mongoose.model('Counter', counterSchema);
