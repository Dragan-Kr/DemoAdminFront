const express = require('express');
const router = express.Router();

const {getAllPosts,getPostById,createPost,updatePost,deletePost,uploadImage} = require('../controller/post');
router.route('/')
.get(getAllPosts)
// .post(createPost)
// .post(uploadImage);
router.route('/:id').get(getPostById).patch(updatePost).delete(deletePost);

module.exports = router;