const express = require('express');
const router = express.Router();
const verifyRoles= require("../middleware/verifyRoles");
const ROLES_LIST = require("../authentication/roles_list");
const postCategoryController = require('../controller/postCategory');


router.get('/',verifyRoles(ROLES_LIST[1]),postCategoryController.getAllPostCategories);
router.post('/',verifyRoles(ROLES_LIST[1]),postCategoryController.createPostCategory);
router.get('/:id',verifyRoles(ROLES_LIST[1]),postCategoryController.getPostCategoryById);
router.delete('/:id',verifyRoles(ROLES_LIST[1]),postCategoryController.deletePostCategory);
router.patch('/:id',verifyRoles(ROLES_LIST[1]),postCategoryController.updatePostCategory);
module.exports = router;