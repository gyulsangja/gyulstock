const bcrypt = require('bcrypt');
const connection = require('../model/database');

const register = async (req, res) => {
    try {
        const { useremail, userpwd, username } = req.body;
        const pool = await connection();
        
        const selectQuery = 'SELECT useremail FROM user WHERE useremail=?'
        const userResult = await pool.query(selectQuery, [useremail]);
        if(userResult[0][0] === undefined){
            const hashedPwd = await bcrypt.hash(userpwd, 10);
            const registerQuery = `INSERT INTO user (username, useremail, userpwd)
            VALUES (?, ?, ?)`
            await pool.query(registerQuery, [username, useremail, hashedPwd]);

            const userIDQuery = `SELECT LAST_INSERT_ID() AS user_id`;
            const userIDResult = await pool.query(userIDQuery);

            if(userIDResult[0][0]){
                res.send({
                    success: true,
                    status: "성공",
                    data: {
                        user_id: userIDResult[0][0].user_id,
                        username: username,
                        useremail: useremail,
                        interestedStocks: []
                    },
                    
                });
            }else{
                res.send({
                    success: false,
                    status: "실패",
                    data: '회원가입 실패',
                });
            }

        }else{
            res.send({
                success: false,
                status: "실패",
                data: '중복된 이메일 입니다.',
            });

        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: '회원가입 실패' });
    }
}

module.exports = { register };