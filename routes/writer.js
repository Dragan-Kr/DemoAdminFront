const express = require('express');
const router = express.Router();

const writerController = require('../controller/writter');

router.get('/', writerController.getAllWritters);
router.post('/', writerController.createWriter);
router.get('/:id', writerController.getWriter);
module.exports = router;