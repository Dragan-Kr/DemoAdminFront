const express = require('express');
const app = express();//konekcija(izmedju ostalog)
const connectDB = require('./db/connect');
const cors = require('cors');
require('dotenv').config();//konekcija
//midleware
app.use(express.json());//konekcija



//extra security packages
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');


const bodyParser = require('body-parser');
const multer=require('multer');

const writerRouter = require('./routes/writer');
const categoryRouter = require('./routes/category');
const postRouter = require('./routes/post');
const postCategory = require('./routes/postCategory');
const authRouter = require('./routes/auth');
const mainRouter =require('./routes/main');


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


//middleware

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler")



///
app.use(cors());
app.use('/api/auth',authRouter);
app.use('/api',mainRouter)

app.use('/api/writer',writerRouter);
app.use('/api/category',categoryRouter);
app.use('/api/post',postRouter);
app.use('/api/postCategory',postCategory);





//protection -- --kada ovo odkomentarisem nece da povuce slike kod update-a
// app.set('trust-proxy',1);
// app.use(rateLimiter({
//     windowMs: 15 * 16 * 1000,//15 minuta
//     max:100 //limit each IP to 100 request per windiwMs
// }));
// app.use(helmet());
// app.use(xss());



//middleware -- i kada ovo odkomentarisem nece da povuce slike kod update-a
app.use(notFoundMiddleware);
app.use(errorMiddleware);





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





  app.post("/api/upload",upload.single("file"),(req,res)=>{
    if (!req.file) {
      res.send({ code: 500, msg: 'err' });
    } else {
      console.log("Res.file",req.file)
      res.send({ code: 200, msg: 'uploaded' })
    }
  })






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



