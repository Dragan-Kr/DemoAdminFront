const express = require('express');
const app = express();//konekcija(izmedju ostalog)

const writerRouter = require('../routes/writer');
const categoryRouter = require('../routes/category');
const postRouter = require('../routes/post');


app.use('/api/post',postRouter);
app.use('/api/writer',writerRouter);
app.use('/api/category',categoryRouter);