const connection = require('../model/database');

const updateLike = async (req, res) => {
    try {
        const { stock_isinCd, user_id } = req.body;
        const pool = await connection();
        
        const insertQuery = `
        INSERT INTO interestedstocks (stock_isinCd, user_id) VALUES (?, ?);
`;
        await pool.query(insertQuery, [stock_isinCd, user_id]);

        const selectQuery = `
            SELECT stock_isinCd
            FROM interestedstocks
            WHERE user_id = ?`;
        const selectResult = await pool.query(selectQuery, user_id);

        const interestedStocks = selectResult[0].map(row => row.stock_isinCd);

        if (selectResult[1]) {
            res.send({ 
                success: true,
                status: "성공",
                data: interestedStocks
            });
        } else {
            res.send({
                success: false,
                status: "실패",
                data: "관심종목 추가 실패"
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: '관심종목 추가 실패' });
    }
}

module.exports = { updateLike };
