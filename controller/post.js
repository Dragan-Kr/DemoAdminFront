const { json } = require('express');
const Post = require('../model/Post');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const bodyParser = require('body-parser');
const express = require('express');
const app = express();//konekcija(izmedju ostalog)
app.use(express.json());
const Counter = require('../model/Counter');
var List = require("collections/list");

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
// app.use(bodyParser.urlencoded({extended:false}));
// const Fs = require('@supercharge/fs')
const fs = require('fs')
// const path = require('node:path'); 
var path2 = require('path');
const getAllPosts = async (req, res) => {

  const posts = await Post.find({});
  res.status(200).json({ posts });

};



app.use('/public', express.static(path2.join(__dirname, 'uploads'))); //public je naziv samo za korisnika

// const getPostById = async (req, res) => {

//   const { id: postID } = req.params;
//   const post = await Post.findOne({ _id: postID });
//   if (!post) {
//     return res.status(404).json({ msg: `No post with id: ${postID}` });
//   }

//   res.status(200).json({ post });
// };



const getPostById = async (req, res) => {
  const { id: postID } = req.params;
  const post = await Post.findOne({ _id: postID });
  
  if (!post) {
    return res.status(404).json({ msg: `No post with id: ${postID}` });
  }

  const filePath = post.images[0];
  console.log("filePath",filePath)
  const fileName = path2.basename(filePath);
  console.log("FileName",fileName)

  console.log("__dirname",__dirname)
  // Set the headers to force download the file
  res.set({
    'Content-Disposition': `attachment; filename="${fileName}"`,
    'Content-Type': 'application/octet-stream'
  });
// console.log("RES",res)

const filePath2 = fs.realpathSync('uploads', []);
console.log("Ovo je filePath od upload direktorijuma", filePath2);


let fullFilePath = path2.join( `${filePath2}`,`${fileName}`);
// let path = `/uploads/${images[index]}`
console.log("FullFilePath",fullFilePath);





const fileData = fs.readFileSync(fullFilePath);
console.log("FileData",fileData)


// Create a response object containing the post and file data
const response = {
  post: post.toObject(),
 
  file: {
    // name: fileName,
    data:"data:" + "image/jpeg" + ";"+ "base64," + fileData.toString('base64')
  },

  file2: {
    name: fileName,
    data: fileData.toString('base64')
  }
};

// Send the response
res.send(response);
  // Send the file
// res.sendFile(path2.join(filePath2,fileName));


  
};




const createPost = async (req, res) => {

  try {
    const { title, shortDescription, mainContent, isPublished, postDate, categories, createdBy, images } = req.body;
    //////////
    const counter = await Counter.findOneAndUpdate(
      { index: "autoval" },
      { "$inc": { "seq": 1 } },
      { new: true }
    );

    let seqId;

    if (counter == null) {
      const newVal = new Counter({ index: "autoval", seq: 1 });
      newVal.save();
      seqId = 1;
    } else {
      seqId = counter.seq;
    }
    /////////////


    const filePath = fs.realpathSync('uploads', []);
    console.log("Ovo je filePath", filePath);

    let arrayOfImagesPaths = [];

    for (let index in images) {
      console.log("Ovo su images",images)
      // let combinedPath = path2.resolve(filePath, images[index]);
      // let properPath = path2.join(filePath, images[index]);
      let path = `/uploads/${images[index]}`
      arrayOfImagesPaths.push(path);
    }

    console.log("arrayOfImagesPaths", arrayOfImagesPaths)
    const post = new Post({
      index: seqId,
      title,
      shortDescription,
      mainContent,
      isPublished,
      postDate,
      categories,
      createdBy,
      images: arrayOfImagesPaths
    });

    console.log("Post", post)
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const updatePost = async (req, res) => {
  const {
    body: { title, shortDescription, mainContent, isPublished, postDate, categories, createdBy, images },
    // writer:{writerId},
    params: { id: postId }
  } = req;



  const tempPost = await Post.findOne({ _id: postId });

   


    let arrayOfImagesPaths = [];

    // for (let index in tempPost.images){
    //   console.log("Ovo su images",images)
      
    //   let path = `/uploads/${images[index]}`
    //   arrayOfImagesPaths.push(path);
    // } 


    for (let index in images) {
      console.log("Ovo su images",images);
      let path = `/uploads/${images[index]}`
      arrayOfImagesPaths.push(path);
    }

    const concatArr = tempPost.images.concat(images)





  console.log("Ovo je arrayOfImagesPaths iz UpdatePost", arrayOfImagesPaths)


  // console.log("Ovo je req.body.title",req.body.title)
  const post = await Post.findByIdAndUpdate({ _id: postId }, { title: req.body.title, shortDescription: req.body.shortDescription, mainContent: req.body.mainContent, isPublished: req.body.isPublished, postDate: req.body.postDate, categories: req.body.categories, createdBy: req.body.createdBy, images: arrayOfImagesPaths }, { new: true, runValidators: true });
  if (!post) {
    throw new NotFoundError(`No post with id ${postId}`);
  }
  if (title === '') {
    throw new BadRequestError('Title cant be empty field');
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
  createPost,
  updatePost,
  deletePost
  // uploadImage,
};