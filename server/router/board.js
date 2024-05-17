const express = require('express');
const router = express.Router();
const {
    readfile,
    deletefile,
    writefile
} =require('../controller/board')

router.post('/', readfile)
router.post('/write', writefile)
router.delete('/delete/:postID', deletefile)

module.exports = router;