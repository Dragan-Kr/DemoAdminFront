const express = require('express');
const router = express.Router();

const postController = require('../controller/post');
const verifyRoles= require("../middleware/verifyRoles");
const ROLES_LIST = require("../authentication/roles_list");

router.get('/',verifyRoles(ROLES_LIST[1]),postController.getAllPosts);
router.post('/',verifyRoles(ROLES_LIST[1]),postController.createPost);
router.get('/:id',verifyRoles(ROLES_LIST[1]),postController.getPostById);
router.delete('/:id',postController.deletePost);
router.patch('/:id',verifyRoles(ROLES_LIST[1]),postController.updatePost);

module.exports = router;