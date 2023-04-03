const { json } = require('express');
const Post = require('../model/Post');
const multer=require('multer');
const upload=multer({dest:'uploads/'});

const express = require('express');
const app = express();//konekcija(izmedju ostalog)

const getAllPosts = async(req,res)=>{

    const posts = await Post.find({});
     res.status(200).json({posts});
   
};



// const imagePost=app.post('/api/post',upload.single('images'), (req,res)=>{

// if(!req.file){
//     res.send({code:500,msg:'err'});
// }else{
//     res.send({code:200,msg:'upload success'});
// }


// });

const getPostById = async(req,res)=>{

  const {id : postID} = req.params;
  const post = await Post.findOne({_id:postID});
    if(!post){
        return res.status(404).json({msg: `No post with id: ${postID}` });
    }
    res.status(200).json({post});
};

const createPost = async(req,res)=>{

    try {
        const { title, shortDescription, mainContent, isPublished,postDate,categories,createdBy } = req.body;
    
        const post = new Post({
          title,
          shortDescription,
          mainContent,
          isPublished,
          postDate,
          categories,         
          createdBy
        });
    
        const newPost = await post.save();
        res.status(201).json(newPost);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    
};


const updatePost=async(req,res)=>{
    const {
        body:{title},
        // writer:{writerId},
        params:{id:postId}
    }=req;
    if(title===''){
        throw new BadRequestError('Title cant be empty field');
    }
    const post = await Post.findByIdAndUpdate({_id:postId},req.body,{new:true,runValidators:true});
    if(!post){
        throw new NotFoundError(`No post with id ${postId}`);
    }
    res.status(200).json({post});
};

const deletePost=async(req,res)=>{
     try {
        const {id:postID} = req.params;
        const post = await Post.findOneAndDelete({_id:postID});
        if(!post){
            return res.status(404).json({msg: `No post with id: ${postID}` });
        }

        res.status(200).json({post});
    } catch (error) {
        res.status(500).json({msg:error});
    }
    res.send('delete post');

};

module.exports={
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    
};