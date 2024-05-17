import React, { useState } from 'react'
import WriteCss from '../../styles/WriteCss.module.css'
import { useSelector } from 'react-redux'
import axios from 'axios'
import FormData from 'form-data'




const Write = ({write, setWrite, setPosts, setPhotos,loadingURL}) => {
    const darkMode = useSelector((state)=>state.darkMode)
    const userData = useSelector((state)=>state.authData.user)
    const INITIAL_STATE = {
        content: '',
        username: userData && userData.username
    };
    
    const [contentData, setContentData] = useState(INITIAL_STATE);
    
    const [fileData, setFileData] = useState([]);

    const handleBlackClick = (e) => {
        e.stopPropagation();
    }

    const handleChange = (e) => {
        setContentData((prev) => ({ ...prev,
            content: e.target.value,
            user_id : userData.user_id,
            username: userData.username
        }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFileData(selectedFiles);
    };
    
    const handleSubmit= async (e)=>{
        e.preventDefault();

        let formData = new FormData();
        formData.append('content', contentData.content);
        formData.append('username', contentData.username);
        formData.append('user_id', contentData.user_id);

        if (fileData.length > 0) {
            fileData.forEach((file, index) => {
                formData.append(`img`, file);
            });
        }

        document.getElementById('file').value = '';
        document.getElementById('textarea').value = '';
        
        
        setWrite(false)
        try{
            axios.post(`${loadingURL}/write`, formData)
            .then((res)=>{
                const postResult = res.data.data.posts
                setPosts(postResult)
                const imgResult = res.data.data.imgs
                setPhotos(imgResult)

            })

        }catch(error){
            console.error(error)
        }finally{
            setContentData(INITIAL_STATE)
            setFileData([])
        }
    }

    

  return (
    <section className={`${WriteCss.write} ${write===true?WriteCss.on:null} ${darkMode==='darkMode'?WriteCss.dark:null}`}>
            <div className={WriteCss.black} onClick={()=>setWrite(false)}>
                <div className={WriteCss.boardWrap} onClick={handleBlackClick}>
                    <div className={WriteCss.top}>
                        <h4>글쓰기</h4>
                        <span onClick={()=>setWrite(false)}><md-icon>close</md-icon></span>
                    </div>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className={WriteCss.content}>
                            <textarea
                                 id='textarea'
                                onChange={handleChange}
                                placeholder='내용을 입력하세요'
                                required
                            >                          
                            </textarea>
                        </div>
                        <div className={WriteCss.file}>
                            <input id='file' type='file' accept='.png, .jpg,image/*' multiple onChange={handleFileChange} />
                        </div>
                        <button type='submit'>게시</button>
                    </form>
                </div>
            </div>
        </section>
  )
}

export default Write
