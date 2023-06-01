

const express = require('express');
const app = express();//konekcija(izmedju ostalog)
const connectDB = require('./db/connect');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();//konekcija
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
const refreshTokenRouter = require('./routes/refreshToken');
const sendEmail =require("./controller/email")

const authentificationMiddleware = require("./middleware/auth")
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler")
var storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'uploads/')
  },
  filename:(req,file,cb)=>{
    cb(null,file.originalname)
  }
})
var upload = multer({storage:storage});




app.use(express.json());//konekcija
app.use(cors());






app.use(cookieParser());

app.use('/api/auth',authRouter);//treba neki ruter da se koristi
app.use('api/auth/token',refreshTokenRouter)
app.use('/api',mainRouter)
app.use('/api/writer',writerRouter);
app.use(authentificationMiddleware)
app.use('/api/category',categoryRouter);
app.use('/api/post',postRouter);
app.use('/api/postCategory',postCategory);

//middleware -- i kada ovo odkomentarisem nece da povuce slike kod update-a

app.use(notFoundMiddleware);
app.use(errorMiddleware);
// app.use(auth)



//http://localhost:8000/images/image1.jpg --pristup slici
//kada stavim uploads umjesto images radi link od slika u postmanu

app.use(bodyParser.json({ limit: '256mb' }));
app.use(bodyParser.urlencoded({ limit: '256', extended: true, parameterLimit: 50000 }));

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
  app.get('/api/send', sendEmail);






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



