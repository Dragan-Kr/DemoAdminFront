const express = require("express");
const app = express(); //konekcija(izmedju ostalog)
const connectDB = require("./db/connect");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config(); //konekcija
const bodyParser = require("body-parser");
// const multer=require('multer');
const writerRouter = require("./routes/writer");
const categoryRouter = require("./routes/category");
const postRouter = require("./routes/post");
const postCategory = require("./routes/postCategory");
const authRouter = require("./routes/auth");
const mainRouter = require("./routes/main");
const refreshTokenRouter = require("./routes/refreshToken");
const allRoutes = require("./routes/allRoutes");
const imageRouter = require("./routes/image");
const sendEmail = require("./controller/email");

const authentificationMiddleware = require("./middleware/auth");
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");



app.use(express.json()); //konekcija
app.use(cors());
app.use(cookieParser());
//http://localhost:8000/uploads/image1.jpg --pristup slici
//kada stavim uploads umjesto images radi link od slika u postmanu

app.use(bodyParser.json({ limit: "256mb" }));
app.use(
  bodyParser.urlencoded({ limit: "256", extended: true, parameterLimit: 50000 })
);

app.use("/uploads", express.static("uploads"));

app.get("/api/send", sendEmail);

app.use("/api/auth", authRouter); //treba neki ruter da se koristi
app.use("api/auth/token", refreshTokenRouter);
app.use(authentificationMiddleware);
app.use("/api/post", postRouter);
app.use("/api/postCategory", postCategory);
app.use("/api/writer", writerRouter);
app.use("/api/category", categoryRouter);
app.use("/", imageRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    //connectDB
    await connectDB(process.env.MONGO_URI);

    app.listen(port, console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
