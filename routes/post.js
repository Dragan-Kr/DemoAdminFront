const express = require('express');
const router = express.Router();

const {getAllPosts,getPostById,createPost,updatePost,deletePost} = require('../controller/post');
router.route('/').get(getAllPosts).post(createPost);
router.route('/:id').get(getPostById).patch(updatePost).delete(deletePost);

module.exports = router;