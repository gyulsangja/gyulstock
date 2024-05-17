const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');

const endpoint = new AWS.Endpoint('http://kr.object.ncloudstorage.com');
const region = 'kr-standard';
const access_key = process.env.DB_ACKEY;
const secret_key = process.env.DB_SEKEY;

const S3 = new AWS.S3({
    endpoint: endpoint,
    region: region,
    credentials: {
        accessKeyId: access_key,
        secretAccessKey: secret_key
    }
});
const bucket_name = process.env.DB_BUCKET;
const upload = multer({ dest: 'uploads/' })

const connection = require('../model/database');

const readfile = async (req, res) => {
    try {
        const pool = await connection();
        
        const selectQuery = 'SELECT * FROM post ORDER BY created_at DESC'
        const selectResult = await pool.query(selectQuery);

        const imgQuery = 'SELECT * FROM photo'
        const imgResult = await pool.query(imgQuery);

        if (selectResult) {
            res.send({
                success: true,
                status: "성공",
                data: {
                    posts : selectResult[0],
                    imgs : imgResult[0]
                }
                
                
            });
        } else {
            res.send({
                success: false,
                status: "실패",
                data: "데이터 로딩 실패",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: '데이터 로딩 실패' });
    }
}

const deletefile = async (req, res) => {
    try {
        const { postID } = req.params;
        
        const pool = await connection();

        const postIDFindQuery = `SELECT photo_count FROM post WHERE post_id = ?`;
        const postIDFindRusult = await pool.query(postIDFindQuery, [postID]);
        if (postIDFindRusult[0][0].photo_count > 0) {
            const deleteImgQuery = `DELETE FROM photo WHERE post_id = ?`;
            await pool.query(deleteImgQuery, [postID]);
            const folderPath = 'gyulstock/' + postID + '/';    
            const listObjectsParams = {
                Bucket: bucket_name,
                Prefix: folderPath 
            };
            try {
                const data = await S3.listObjects(listObjectsParams).promise();
                const objects = data.Contents;

                const deleteObjectsParams = {
                    Bucket: bucket_name,
                    Delete: {
                        Objects: objects.map(obj => ({ Key: obj.Key }))
                    }
                };
                await S3.deleteObjects(deleteObjectsParams).promise();
            } catch (error) {
                console.error(error);
            }
        }
        const deleteQuery = `DELETE FROM post WHERE post_id = ?`;
        await pool.query(deleteQuery, [postID]);        

        const selectQuery = 'SELECT * FROM post ORDER BY created_at DESC';
        const selectResult = await pool.query(selectQuery);

        const imgQuery = 'SELECT * FROM photo'
        const imgResult = await pool.query(imgQuery);

        if (selectResult) {
            res.send({
                success: true,
                status: "성공",
                data: {
                    posts : selectResult[0],
                    imgs : imgResult[0]
                }
            });
        } else {
            res.send({
                success: false,
                status: "실패",
                data: "데이터 로딩 실패",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: '데이터 로딩 실패' });
    }
}


const writefile = (req, res) => {

    upload.array('img', 8)(req, res, async (err)=>{
        const currentDate = new Date();
        try {
            const { user_id, content, username } = req.body;
            const files = req.files;
            const filesLength = files.length
            const pool = await connection();
            const insertQuery = `INSERT INTO post (user_id, username, content, created_at, photo_count)
            VALUES (?, ?, ?, ?, ?)`;
            const insertResult = await pool.query(insertQuery, [user_id, username, content, currentDate, filesLength]);

            if(filesLength > 0){
                const postIDQuery = `SELECT LAST_INSERT_ID() AS post_id`;
                const postIdResult = await pool.query(postIDQuery);

                for (let i = 0; i < files.length; i++) {
                    const file_path = files[i].path;
                    const object_name = 'gyulstock/'+ postIdResult[0][0].post_id + '/' + files[i].filename +files[i].originalname;
                    
                    await S3.putObject({
                        Bucket: bucket_name,
                        Key: object_name,
                        ACL: 'public-read',
                        Body: fs.createReadStream(file_path)
                    }).promise();

                    const fileURL = `https://kr.object.ncloudstorage.com/gyulstorage/` + object_name

                    const photoQuery = `INSERT INTO photo (post_id, img_url, img_num)
                            VALUES (?, ?, ?)`;
                    const photoResult = await pool.query(photoQuery, [postIdResult[0][0].post_id, fileURL, i]);
                }
            }

            const selectQuery = 'SELECT * FROM post ORDER BY created_at DESC';
            const selectResult = await pool.query(selectQuery);

            const imgQuery = 'SELECT * FROM photo'
            const imgResult = await pool.query(imgQuery);

            if (selectResult) {
                res.send({
                    success: true,
                    status: "성공",
                    data: {
                        posts : selectResult[0],
                        imgs : imgResult[0],
                        
                    }
                    
                    
                });
            } else {
                res.send({
                    success: false,
                    status: "실패",
                    data: "데이터 로딩 실패",
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).send({ message: '데이터 로딩 실패' });
        }



    })
    
}


module.exports = { readfile, deletefile, writefile};