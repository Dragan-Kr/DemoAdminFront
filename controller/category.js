const Category=require('../model/Category');


const getAllCategories = async(req,res)=>{
   const categories = await Category.find({});
   res.status(200).json({categories});
};

const getCategoryById = async(req,res)=>{
    const {id : categoryID} = req.params;
    const category = await Category.findOne({_id:categoryID}); 
    if(!category){
        // const error = new Error('Not found');
        // error.status = 404;
        // return next(error);
        // return res.status(404).json({msg: `No task with id: ${taskID}` });
        return res.status(404).json({msg: `No category with id: ${categoryID}` });
    }
    
    res.status(200).json({category});

};

const createCategory = async(req,res)=>{
    const category = await Category.create(req.body);
    res.status(201).json({category});  
};

module.exports={
    getAllCategories,
    getCategoryById,
    createCategory
};