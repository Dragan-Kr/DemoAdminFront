const mongoose = require("mongoose");
// const { format } = require('date-fns');

// const autoIncrement = require("mongoose-auto-increment");

const postSchema = new mongoose.Schema({
  index: { type: Number },

  title: {
    type: String,
    required: [true, "Please provide title"],
    maxlength: [50,'Maximum length for title is 50'],
    minlength:[2,'Minimum length for title is 2']
  },

  shortDescription: {
    type: String,
    // maxlength: [30,'Maximum length for shortDescription is 30'],
  },

  mainContent: {
    type: String,
    // maxlength: [400,'Maximum length for shortDescription is 400'],
  },

  isPublished: {
    type: Boolean,
    default: false,
  },
  postDate: {
    type: Date,
  },
  categories: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
  ],

  createdBy: {
    //one to many tj.user ima vise poslova
    type: mongoose.Types.ObjectId,
    ref: "Writer", //referenca na odredjenog USER-a,
    required: [true, "Please provide writter"],
  },
  images: [
    {
      type: String,
    },
  ],
  time: {
    type: String,
  },
});

// autoIncrement.initialize(mongoose.connection);
// postSchema.plugin(autoIncrement.plugin, { model: 'Post', field: 'index' });

module.exports = mongoose.model("Post", postSchema);

// autoIncrement.initialize(mongoose.connection);
// postSchema.plugin(autoIncrement.plugin, {
//    model:'postSchema',
//    field: 'index',
//    startAt: 1,
//    incrementBy: 1
// });
