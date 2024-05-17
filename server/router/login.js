const express = require('express');
const router = express.Router();
const {
    postLogin
} =require('../controller/login')

router.post('/', postLogin)

module.exports = router;