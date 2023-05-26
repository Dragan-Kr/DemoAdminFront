const express = require('express');
const router = express.Router();


const refreshTokenController = require("../controller/refreshToken");

router.get("/",refreshTokenController.handleRefreshToken);
module.exports = router;