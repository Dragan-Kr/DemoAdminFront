const express = require('express');
const app = express();//konekcija(izmedju ostalog)
const connectDB = require('./db/connect');
const cors = require('cors');
require('dotenv').config();//konekcija
//midleware
app.use(express.json());//konekcija


const bodyParser = require('body-parser');
const multer=require('multer');

const writerRouter = require('./routes/writer');
const categoryRouter = require('./routes/category');
const postRouter = require('./routes/post');
const postCategory = require('./routes/postCategory');

// const upload=multer({dest:'uploads/',filename: function(req, file, cb) {
//   cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
// }});


var storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'uploads/')
  },
  filename:(req,file,cb)=>{
    cb(null,file.originalname)
  }
})

var upload = multer({storage:storage});


app.use(bodyParser.json({ limit: '256mb' }));
app.use(bodyParser.urlencoded({ limit: '256', extended: true, parameterLimit: 50000 }));

// app.use(express.static(__dirname + '/public'));
const Post = require('./model/Post');
const Writer = require('./model/Writer');

//routes

// const imageRouter = require('./routes/postCategory');


///
app.use(cors());
app.use('/api/writer',writerRouter);
app.use('/api/category',categoryRouter);
app.use('/api/post',postRouter);
app.use('/api/postCategory',postCategory);



//http://localhost:8000/images/image1.jpg --pristup slici
//kada stavim uploads umjesto images radi link od slika u postmanu

app.use('/uploads', express.static('uploads'));


app.post('/api/image', upload.array('images2',20), (req, res) => {//OZNACENO
    if (!req.file) {
      res.send({ code: 500, msg: 'err' });
    } else {
      console.log("Res.file",req.file)
      res.send({ code: 200, msg: 'uploaded' })
    }
   
  });

  //NA TUTORIALU OVAKO
  // app.post("/api/upload",upload.single("file"),(req,res)=>{
  //   const file = req.file;
  //   res.status(200).json(file.filename);
  // })






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



