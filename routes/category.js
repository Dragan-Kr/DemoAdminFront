const express = require('express');
const router = express.Router();

const categoryController = require('../controller/category');
const ROLES_LIST = require("../authentication/roles_list");
const verifyRoles= require("../middleware/verifyRoles");



router.get('/',verifyRoles(ROLES_LIST[1]),categoryController.getAllCategories);
router.post('/',categoryController.createCategory);
router.get('/:id',verifyRoles(ROLES_LIST[1]),categoryController.getCategoryById);

module.exports = router;