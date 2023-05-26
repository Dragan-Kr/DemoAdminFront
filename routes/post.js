const express = require('express');
const router = express.Router();

const postController = require('../controller/post');
const verifyRoles= require("../middleware/verifyRoles");
const ROLES_LIST = require("../authentication/roles_list");
router.get('/',postController.getAllPosts);

router.post('/',verifyRoles(ROLES_LIST.Editor,ROLES_LIST.Admin),postController.createPost);
router.get('/:id',postController.getPostById);
router.delete('/:id',postController.deletePost);
router.patch('/:id',verifyRoles(ROLES_LIST.Editor,ROLES_LIST.Admin),postController.updatePost);

module.exports = router;