const bcrypt = require('bcrypt');
const connection = require('../model/database');

const postLogin = async (req, res) => {
    try {
        
        const { useremail, userpwd } = req.body;
        const pool = await connection();

        const selectQuery = 'SELECT username, useremail, user_id, userpwd FROM user WHERE useremail=?'
        const userResult = await pool.query(selectQuery, [useremail]);
        
        let match = false;
        for (let a = 0; a < userResult[0].length; a++) {
            match = await bcrypt.compare(userpwd, userResult[0][a].userpwd);
        }

        let resData = {};
        if(!match){
            resData = {
                success: false,
                message: "아이디 또는 비밀번호를 확인하세요.",
              };
              return res.send(resData);
        }else{
            const stockQuery = 'SELECT * FROM interestedstocks WHERE user_id = (SELECT user_id FROM user WHERE useremail=? AND userpwd=?)'
            const interestedStocksResult = await pool.query(stockQuery, [useremail, userpwd]);

            const interestedStocks = interestedStocksResult[0].map(row => row.stock_isinCd);
            if (interestedStocksResult[0]) {
                res.send({
                    success: true,
                    status: "성공",
                    data: {
                        user_id: userResult[0][0].user_id,
                        username: userResult[0][0].username,
                        useremail: userResult[0][0].useremail,
                        interestedStocks: interestedStocks
                    },
                    
                });
            } else {
                res.send({
                    success: false,
                    status: "실패",
                    data: "email or password checked",
                });
            }
        }
        
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: '로그인 실패' });
    }
}

module.exports = { postLogin };


