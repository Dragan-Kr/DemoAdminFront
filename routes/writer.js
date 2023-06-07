const express = require('express');
const router = express.Router();

const writerController = require('../controller/writter');
const ROLES_LIST = require("../authentication/roles_list");
const verifyRoles= require("../middleware/verifyRoles");


router.get('/',verifyRoles(ROLES_LIST[1]), writerController.getAllWritters);
router.post('/', writerController.createWriter);
router.get('/:id',verifyRoles(ROLES_LIST[1]), writerController.getWriter);
module.exports = router;