const express = require('express');
const router = express.Router();

const imageController = require('../controller/image');
const verifyRoles= require("../middleware/verifyRoles");
const ROLES_LIST = require("../authentication/roles_list");

router.post('/api/image',verifyRoles(ROLES_LIST[1]),imageController.uploadMultipleImages)
router.post('/api/upload',verifyRoles(ROLES_LIST[1]),imageController.uploadOneImage)

module.exports = router;