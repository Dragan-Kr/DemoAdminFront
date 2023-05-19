// const express = require('express');
// const router = express.Router();

// const {login,register} = require('../controllers/auth');
// router.post('/register',register);
// router.post('/login',login);

// module.exports = router;


const auth = require('../authentication/auth');
const express = require('express');
const router = express.Router();


router.post('/register',auth.register);
router.post('/login',auth.login);



module.exports = router;