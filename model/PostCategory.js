const mongoose = require('mongoose');

const postCategorySchema = new mongoose.Schema({

    post:{//one to many tj.user ima vise poslova
        type:mongoose.Types.ObjectId,
        ref:'Post',//referenca na odredjenog USER-a,
        required:[true,'Please provide post']
    },

    category:{
        type:mongoose.Types.ObjectId,
        ref:'Category',//referenca na odredjenog USER-a,
        required:[true,'Please provide category']
    }



});module.exports = mongoose.model('PostCategory',postCategorySchema);