const Writer = require('../model/Writer');

const getAllWritters = async (req,res)=>{
  const writers = await Writer.find({});
  res.status(200).json({writers});
};

const createWriter = async (req,res)=>{
    const writer = await Writer.create(req.body);
    res.status(201).json({writer});
};

const getWriter = async(req,res)=>{
  const {id : writerID} = req.params;
  const writer = await Writer.findOne({_id:writerID});

  if(!writer){
    // const error = new Error('Not found');
    // error.status = 404;
    // return next(error);
    // return res.status(404).json({msg: `No task with id: ${taskID}` });
    return res.status(404).json({msg: `No writer with id: ${writerID}` });
}

res.status(200).json({writer});

};

module.exports={
  getAllWritters,//eksportovali kao objekat
  createWriter,
  //getWriter
};