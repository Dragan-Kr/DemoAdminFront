const express = require('express');
const router = express.Router();

const categoryController = require('../controller/category');

router.get('/',categoryController.getAllCategories);
router.post('/',categoryController.createCategory);
router.get('/:id',categoryController.getCategoryById);

module.exports = router;