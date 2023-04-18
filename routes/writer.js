const express = require('express');
const router = express.Router();

const {getAllWritters,createWriter,getWriter} =require('../controller/writter');
// router.route('/:id').get(getWriter);
router.route('/').get(getAllWritters).post(createWriter);
// router('get', '/rajoasdasd')
module.exports = router;