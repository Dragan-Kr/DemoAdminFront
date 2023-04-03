const PostCategory = require('../model/PostCategory');



const getAllPostCategories = async(req,res)=>{

    const postCategories = await PostCategory.find({});
    res.status(200).json({postCategories});
};


const getPostCategoryById = async(req,res)=>{

    const {id : postCategoryID} = req.params;
    const postCategory = await Post.findOne({_id:postCategoryID});
      if(!postCategory){
          return res.status(404).json({msg: `No postCategory with id: ${postCategoryID}` });
      }
  
      res.status(200).json({postCategory});
  };

  const createPostCategory = async(req,res)=>{
    // req.body.createdBy = req.user.writerId;
    const postCategory = await PostCategory.create(req.body);
    res.status(201).json({postCategory});
};
  

const updatePostCategory=async(req,res)=>{
    const {
       
        // writer:{writerId},
        params:{id:postCategoryID}
    }=req;
    
    const postCategory = await PostCategory.findByIdAndUpdate({_id:postCategoryID},req.body,{new:true,runValidators:true});
    if(!postCategory){
        throw new NotFoundError(`No postCategory with id ${postCategoryID}`);
    }
    res.status(200).json({postCategory});
};

const deletePostCategory=async(req,res)=>{
    try {
       const {id:postCategoryID} = req.params;
       const postCategory = await PostCategory.findOneAndDelete({_id:postCategoryID});
       if(!postCategory){
           return res.status(404).json({msg: `No postCategory with id: ${postCategoryID}` });
       }

       res.status(200).json({postCategory});
   } catch (error) {
       res.status(500).json({msg:error});
   }
   res.send('delete postCategory');

};

module.exports={
    getAllPostCategories,
    getPostCategoryById,
    createPostCategory,
    updatePostCategory,
    deletePostCategory
};