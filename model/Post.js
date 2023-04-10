const mongoose = require('mongoose');
// const { format } = require('date-fns');

const autoIncrement = require('mongoose-auto-increment');

const postSchema = new mongoose.Schema({
   index: { type: Number },

   title: {
      type: String,
      required: [true, 'Please provide post title'],
      maxlength: 50
   },

   shortDescription: {
      type: String,
      maxlength: 30
   },

   mainContent: {
      type: String,
      maxlength: 400
   },

   isPublished: {
      type: Boolean,
      default: false
   },
   postDate: {
      type: Date,
      // get: (value) => format(value, 'DD MMM YYYY'),
      // set: (value) => new Date(value)
      // default:Date.now()
   },
   categories: [{
      type: mongoose.Types.ObjectId,
      ref: "Category"
   }
   ],
   images: [{
      type: String
   }],

   createdBy: {//one to many tj.user ima vise poslova
      type: mongoose.Types.ObjectId,
      ref: 'Writer',//referenca na odredjenog USER-a,
      required: [true, 'Please provide writter']

   }


});

// autoIncrement.initialize(mongoose.connection);
// postSchema.plugin(autoIncrement.plugin, { model: 'Post', field: 'index' });


module.exports = mongoose.model('Post', postSchema);






// autoIncrement.initialize(mongoose.connection);
// postSchema.plugin(autoIncrement.plugin, {
//    model:'postSchema',
//    field: 'index', 
//    startAt: 1,
//    incrementBy: 1
// });
