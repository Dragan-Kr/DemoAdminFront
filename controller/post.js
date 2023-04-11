const { json } = require('express');
const Post = require('../model/Post');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const bodyParser = require('body-parser');
const express = require('express');
const app = express();//konekcija(izmedju ostalog)
app.use(express.json());
const Counter = require('../model/Counter');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
// app.use(bodyParser.urlencoded({extended:false}));
const Fs = require('@supercharge/fs')



const getAllPosts = async (req, res) => {

  const posts = await Post.find({});
  res.status(200).json({ posts });

};




const getPostById = async (req, res) => {

  const { id: postID } = req.params;
  const post = await Post.findOne({ _id: postID });
  if (!post) {
    return res.status(404).json({ msg: `No post with id: ${postID}` });
  }
  res.status(200).json({ post });
};





// app.post('/api/post/',async (req,res) => {

//     try {
//       const { title, shortDescription, mainContent, isPublished, postDate, categories, createdBy } = req.body;
//       //////////
//       console.log("Images iz servera",images)
//       const counter = await Counter.findOneAndUpdate(
//         { index: "autoval" },
//         { "$inc": { "seq": 1 } },
//         { new: true }
//       );

//       let seqId;

//       if (counter == null) {
//         const newVal = new Counter({ index: "autoval", seq: 1 });
//          newVal.save();
//         seqId = 1;
//       } else {
//         seqId = counter.seq;
//       }
//       /////////////

//       const post = new Post({
//         index: seqId,
//         title,
//         shortDescription,
//         mainContent,
//         isPublished,
//         postDate,
//         categories,
//         createdBy,
//       });

//       const newPost =await post.save();
//       res.status(201).json(newPost);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   },upload.any());
















// const createPost = (async (req, res) => {



//   try {
//     console.log(req.files, 111)
//     console.log(req.images, 222)



//     await upload.array('images');


//     uploadImage().then(data => {
//       console.log(data)
//     })
//       .catch(err => {
//         console.log(err)
//       })


//     res.status(201).json({});

//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// })


const updatePost = async (req, res) => {
  const {
    body: { title },
    // writer:{writerId},
    params: { id: postId }
  } = req;
  if (title === '') {
    throw new BadRequestError('Title cant be empty field');
  }
  const post = await Post.findByIdAndUpdate({ _id: postId }, req.body, { new: true, runValidators: true });
  if (!post) {
    throw new NotFoundError(`No post with id ${postId}`);
  }
  res.status(200).json({ post });
};

const deletePost = async (req, res) => {
  try {
    // const {_id:postID} = req.params;

    const { params: { id: postID } } = req;
    const post = await Post.findOneAndDelete({ _id: postID });

    if (!post) {
      return res.status(404).json({ msg: `No post with id: ${postID}` });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
  res.send('delete post');

};

module.exports = {
  getAllPosts,
  getPostById,
  // createPost,
  updatePost,
  deletePost,
  // uploadImage,

};