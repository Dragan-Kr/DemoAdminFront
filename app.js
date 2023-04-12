const express = require('express');
const app = express();//konekcija(izmedju ostalog)
const connectDB = require('./db/connect');
const cors = require('cors');
require('dotenv').config();//konekcija
//midleware
app.use(express.json());//konekcija


const bodyParser = require('body-parser');
const multer=require('multer');
const upload=multer({dest:'uploads/'});
const Post = require('./model/Post');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));



//routes
const writerRouter = require('./routes/writer');
const categoryRouter = require('./routes/category');
const postRouter = require('./routes/post');
const postCategory = require('./routes/postCategory');
// const imageRouter = require('./routes/postCategory');


///
app.use(cors());
app.use('/api/writer',writerRouter);
app.use('/api/category',categoryRouter);
app.use('/api/post',postRouter);
app.use('/api/postCategory',postCategory);
// app.use('/api/image',imageRouter);




app.post('/api/image', upload.array('images2[]'), (req, res) => {//radi


// console.log("Req.file",req)

    if (!req.file) {
      res.send({ code: 500, msg: 'err' });
    } else {
      res.send({ code: 200, msg: 'uploaded' });
    }
   
  });



  // app.post('/api/image', upload.array('images2[]'), (req, res)  => {
  //   new Promise((resolve, reject) => {
  //     if (!req.file) {
  //       reject({ code: 500, msg: 'err' });
  //     } else {
  //       resolve({ code: 200, msg: 'uploaded' });
  //     }
  //   })
  //   .then((response) => {
  //     res.send(response);
  //   })
  //   .catch((error) => {
  //     res.send(error);
  //   });
  // });
  


  


const port = process.env.PORT || 8000;

const start = async () =>{
 
    try {
        //connectDB
        await connectDB(process.env.MONGO_URI);

        app.listen(port,console.log(`Server is listening port ${port}...`));
    } catch (error) {
        console.log(error);
    }

};





start();



// app.post('/api/post/',upload.any(),async (req,res) => {

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
//   });

