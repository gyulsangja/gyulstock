const express = require('express');
const router = express.Router();
const {
    updateLike
} =require('../controller/stock')

router.post('/', updateLike)
router.get('/', (req,res)=>{
    res.send('test')
})

module.exports = router;