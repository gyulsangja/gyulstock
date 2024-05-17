const connection = require('../model/database');

const deleteLike = async (req, res) => {
    try {
        const { stock_isinCd, user_id } = req.body;
        const pool = await connection();

        const deleteQuery = `
            DELETE FROM interestedstocks 
            WHERE user_id = ? AND stock_isinCd = ?;
        `

        await pool.query(deleteQuery, [user_id, stock_isinCd]);

        const selectQuery = `
            SELECT stock_isinCd FROM interestedstocks
            WHERE user_id = ?;
        `
        const selectResult = await pool.query(selectQuery, [user_id]);

        const interestedStocks = selectResult[0].map(row => row.stock_isinCd);

        if (selectResult) {
            
            res.send({ 
                success: true,
                status: "성공",
                data: interestedStocks
            });
        } else {
            res.send({
                success: false,
                status: "실패",
                data: "삭제를 실패하였습니다."
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: '삭제 실패' });
    }
}

module.exports = { deleteLike };
