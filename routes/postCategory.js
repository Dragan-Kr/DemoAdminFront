const express = require('express');
const router = express.Router();

const postCategoryController = require('../controller/postCategory');
router.get('/',postCategoryController.getAllPostCategories);
router.post('/',postCategoryController.createPostCategory);
router.get('/:id',postCategoryController.getPostCategoryById);
router.delete('/:id',postCategoryController.deletePostCategory);
router.patch('/:id',postCategoryController.updatePostCategory);
module.exports = router;