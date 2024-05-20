var express = require("express");
var app = express();
const path = require('path')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3500;

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.listen(PORT, ()=>{
    console.log('server on ' + PORT)
})

app.use(express.static(path.join(__dirname, '/build')))

app.get('/', (req, res)=>{
    //res.send('gyulstock')
    res.sendFile(path.join(__dirname, '/build', 'index.html'))
})

app.use('/login', require('./router/login.js'))
app.use('/stock', require('./router/stock.js'))
app.use('/board', require('./router/board.js'))
app.use('/like', require('./router/like.js'))
app.use('/register', require('./router/register.js'))

