const express = require('express');
const router = express.Router();

const postController = require('../controller/post');


router.get('/',postController.getAllPosts);

router.post('/',postController.createPost);
router.get('/:id',postController.getPostById);
router.delete('/:id',postController.deletePost);
router.patch('/:id',postController.updatePost);
module.exports = router;