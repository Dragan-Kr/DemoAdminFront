const express = require('express');
const router = express.Router();

const {getAllCategories,getCategoryById,createCategory} = require('../controller/category');
router.route('/').get(getAllCategories).post(createCategory);
router.route('/:id').get(getCategoryById);

module.exports = router;