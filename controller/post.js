const { json } = require("express");
const Post = require("../model/Post");
const bodyParser = require("body-parser");
const express = require("express");
const app = express(); //konekcija(izmedju ostalog)
app.use(express.json());
const Counter = require("../model/Counter");
// var List = require("collections/list");

// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
// app.use(bodyParser.urlencoded({extended:false}));
// const Fs = require('@supercharge/fs')
const fs = require("fs");
var path2 = require("path");

app.use("/public", express.static(path2.join(__dirname, "uploads"))); //public je naziv samo za korisnika





const getAllPosts = async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  // const endIndex = (page - 1) * limit +limit; //ovako je na frontu nekaed bilo

  const sortField = req.query.sortField || "index";
  const sortOrder = req.query.sortOrder || "asc";
  console.log("SORT ORDER", sortOrder);
  const searchTerm = req.query.searchTerm || "";
  let skip = (page - 1) * limit;
  // let data = await Post.find({}).limit(limit).skip(skip);// fetch data from a database or other source

  let data = await Post.find({});
  let allDataLength = (await Post.find({})).length;

  if (searchTerm != "") {
    console.log("SEARCH TERM", searchTerm);
    let allData = await Post.find({});
    data = allData.filter((item) => {
      return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
    allDataLength = data.length;
  }

  if (sortField.length > 0) {
    // console.log("SortField",sortField)

    const sortedData = data.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      // console.log("aVal",aVal)
      // console.log("bVal",bVal)

      if (sortField === "time") {
        let [hoursA, minutesA] = aVal.split(":").map(Number);
        let [hoursB, minutesB] = bVal.split(":").map(Number);
        if (hoursA > hoursB || (hoursA === hoursB && minutesA > minutesB)) {
          return sortOrder === "asc" ? 1 : -1;
        } else if (
          hoursA < hoursB ||
          (hoursA === hoursB && minutesA < minutesB)
        ) {
          return sortOrder === "asc" ? -1 : 1;
        } else {
          console.log("A and B are equal");
        }
      }

      if (aVal < bVal) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

    const results = sortedData.slice(startIndex, endIndex);
    // console.log("Results", results)

    data = results;
  }

  if (endIndex < data.length) {
    data.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    data.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  // console.log("DATA BEFORE SENDING", data)

  res.json({
    data: data,
    page: page,
    totalPages: Math.ceil(allDataLength / limit), //ovde problem
    allDataLength: allDataLength,
  });
};

const getPostById = async (req, res) => {
  const { id: postID } = req.params;

  const post = await Post.findOne({ _id: postID });

  if (!post) {
    return res.status(404).json({ msg: `No post with id:${postID}` });
  }

  const fs = require("fs");

  const imageArr = post.images;

  for (let image of imageArr) {
    //ovaj cijeli for mi mozda i ne treba

    console.log("IMAGE", image);

    if (fs.existsSync(`.${image}`)) {
      console.log("file exists");
    } else {
      console.log("file not found!");
    }
  }

  res.status(200).json({ post });
};

/////////////////////////////////////////////////////////
// const getPostById = async (req, res) => {
//   const { id: postID } = req.params;
//   const post = await Post.findOne({ _id: postID });

//   if (!post) {
//     return res.status(404).json({ msg: `No post with id: ${postID}` });
//   }

//   // res.set({
//   //   'Content-Disposition': `attachment; filename="${fileName}"`,
//   //   'Content-Type': 'application/octet-stream'
//   // });

//   console.log("Post images",post.images)
//   if (post.images.length > 0) {
//     let responseArray = [];
//     for (let index in post.images) {

//       let response = imageFunct(post, post.images[index]);

//       responseArray.push(response);
//     }
//     console.log("Ovo je responseArray",responseArray)

//     // Send the response
//     res.send(responseArray);
//   } else {
//     res.status(200).json({ post });
//   }
// };

// imageFunct = (post, image) => {
//   console.log("imageFunct->post",post)
//   console.log("imageFunct->image",image)

//   const filePath = image;
//   const fileName = path2.basename(filePath);

//   const filePath2 = fs.realpathSync('uploads', []);

//   let fullFilePath = path2.join(`${filePath2}`, `${fileName}`);
//   const fileData = fs.readFileSync(fullFilePath);
//   const response = {
//     post: post.toObject(),

//     file: {
//       // name: fileName,
//       data: "data:" + "image/jpeg" + ";" + "base64," + fileData.toString('base64')
//     },

//     file2: {
//       name: fileName,
//       data: fileData.toString('base64')
//     }
//   };
//   return response;
// }

/////////////////////////////
const createPost = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      mainContent,
      isPublished,
      postDate,
      categories,
      createdBy,
      images,
    } = req.body;
    console.log("CREATE POST->IMAGES", images);
    //////////
    const counter = await Counter.findOneAndUpdate(
      { index: "autoval" },
      { $inc: { seq: 1 } },
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

    const filePath = fs.realpathSync("uploads", []);
    console.log("Ovo je filePath", filePath);

    let arrayOfImagesPaths = [];

    for (let index in images) {
      console.log("Ovo su images", images);
      // let combinedPath = path2.resolve(filePath, images[index]);
      // let properPath = path2.join(filePath, images[index]);
      let path = `./uploads/${images[index]}`;
      arrayOfImagesPaths.push(path);
    }

    console.log("arrayOfImagesPaths", arrayOfImagesPaths);
    console.log("Tip postDate je", typeof postDate);

    let date = new Date();
    // console.log("DATE", date)
    // get current hours
    let hours = date.getHours();
    console.log("HOURS", hours);
    // // get current minutes
    let minutes = date.getMinutes();

    console.log("MINUTES TYPE", typeof minutes);
    // // get current seconds
    let hoursAndMinutes;
    if (minutes < 10) {
      hoursAndMinutes = hours + ":" + "0" + minutes;
    } else {
      hoursAndMinutes = hours + ":" + minutes;
    }

    // console.log("hoursAndMinutes", hoursAndMinutes);
    // let time = Number()
    // console.log("Hours",hours)
    const post = new Post({
      index: seqId,
      title,
      shortDescription,
      mainContent,
      isPublished,
      postDate,
      categories,
      createdBy,
      images,
      time: hoursAndMinutes,
    });

    //console.log("Post", post)
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
   return res.status(400).json({ message: err.message });
  }
};

const updatePost = async (req, res) => {
  const {
    body: {
      title,
      shortDescription,
      mainContent,
      isPublished,
      postDate,
      categories,
      createdBy,
      images,
    },
    // writer:{writerId},
    params: { id: postId },
  } = req;

  const tempPost = await Post.findOne({ _id: postId });
  console.log("UPDATE POST->IMAGES", images);

  let arrayOfImagesPaths = [];
  for (let index in images) {
    console.log("Ovo su images", images);
    let path = `/uploads/${images[index]}`;
    arrayOfImagesPaths.push(path);
  }

  const concatArr = tempPost.images.concat(images);

  console.log("Ovo je arrayOfImagesPaths iz UpdatePost", arrayOfImagesPaths);

  // console.log("Ovo je req.body.title",req.body.title)
  const post = await Post.findByIdAndUpdate(
    { _id: postId },
    {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      mainContent: req.body.mainContent,
      isPublished: req.body.isPublished,
      postDate: req.body.postDate,
      categories: req.body.categories,
      createdBy: req.body.createdBy,
      images: req.body.images,
    },
    { new: true, runValidators: true }
  );
  if (!post) {
    throw new NotFoundError(`No post with id ${postId}`);
  }
  
  res.status(200).json({ post });
};

const deletePost = async (req, res) => {
  try {
    // const {_id:postID} = req.params;

    const {
      params: { id: postID },
    } = req;
    const post = await Post.findOneAndDelete({ _id: postID });

    if (!post) {
      return res.status(404).json({ msg: `No post with id: ${postID}` });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
  res.send("delete post");
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  // uploadImage,
};
