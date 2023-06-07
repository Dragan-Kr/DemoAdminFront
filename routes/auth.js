// const express = require('express');
// const router = express.Router();

// const {login,register} = require('../controllers/auth');
// router.post('/register',register);
// router.post('/login',login);

// module.exports = router;


const auth = require('../authentication/auth');
const express = require('express');
const router = express.Router();
// const ROLES_LIST = require("../authentication/roles_list");
// const verifyRoles= require("../middleware/verifyRoles");



router.post('/register',auth.register);
router.post('/login',auth.login);
router.post('/logout',auth.logout)


module.exports = router;