const express = require('express');
const { register } = require('../controllers/auth.js');
const { login } = require('../controllers/auth.js');
const auth = require('../middleware/auth.js');

const router = express.Router();

router.post('/register' , register)
router.post('/login' , login)


router.post('/product' , auth ,  )

module.exports = router;