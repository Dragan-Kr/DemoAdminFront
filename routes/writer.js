const express = require('express');
const router = express.Router();

const {getAllWritters,createWriter,getWriter} =require('../controller/writter');
router.route('/').get(getAllWritters).post(createWriter);
router.route('/:id').get(getWriter);
module.exports = router;