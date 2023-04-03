const express = require('express');
const router = express.Router();

const { getAllPostCategories,
    getPostCategoryById,
    createPostCategory,
    updatePostCategory,
    deletePostCategory
}=require('../controller/postCategory');

router.route('/').get(getAllPostCategories).post(createPostCategory);
router.route('/:id').get(getPostCategoryById).patch(updatePostCategory).delete(deletePostCategory);

module.exports = router;