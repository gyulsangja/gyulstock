const mysql = require('mysql2/promise');

const connection = async () => {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            password: process.env.DB_PWD,
            connectionLimit: 5,
        });

        console.log('DB 연결성공');
        return pool;
    } catch (error) {
        console.error('DB 연결실패');
        throw error;
    }
};

module.exports = connection;