const express = require('express');
const router = express.Router();
const {
    deleteLike
} =require('../controller/like')

router.put('/', deleteLike)

module.exports = router;