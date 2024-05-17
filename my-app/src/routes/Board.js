import React, { useEffect, useState } from 'react'
import BoardCss from '../styles/BoardCss.module.css'
import { useSelector } from 'react-redux'
import '@material/web/icon/icon.js';
import textImg from '../assets/stock_bg.jpg'
import { Write } from '../components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Board = () => {
    const darkMode = useSelector((state)=>state.darkMode)
    const userData = useSelector((state)=>state.authData.user)
    const [write, setWrite] =useState(false);
    const [posts, setPosts] = useState();
    const [photos, setPhotos] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    const Navigate = useNavigate()
    
    const loadingURL = 'http://localhost:80/board'
    
    const axiosHandle = async (req, res) => {
        
        try {
            const result = await axios.post(loadingURL);
            const postResult = result.data.data.posts
            setPosts(postResult)
            const imgResult = result.data.data.imgs
            setPhotos(imgResult)
            setIsLoading(false)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(()=>{
    axiosHandle();
    }, [])

    const imgFilter = (e) => {
        return photos.filter(img => [e].includes(img.post_id));
    }

    const writeHandle = ()=>{
        if(userData === null){
            Navigate('/login')
        }else{
            setWrite(true)
        }
    }

    const deleteHandle = async (post_id) => {
        const postId = post_id
        try {
            const result = await axios.delete(`http://localhost:3500/board/delete/${postId}`);
            const postResult = result.data.data.posts
            setPosts(postResult)
            const imgResult = result.data.data.imgs
            setPhotos(imgResult)
            setIsLoading(false)
        } catch (error) {
            console.error(error);
        }
    }



    const formatDateTime = (e)=>{
        const dateTime = new Date(e);

        const year = dateTime.getFullYear().toString().slice(-2);
        const month = dateTime.getMonth() + 1;
        const day = dateTime.getDate();
        const hour = dateTime.getHours().toString().padStart(2, '0');
        const minute = dateTime.getMinutes().toString().padStart(2, '0');

        return `${year}/${month}/${day} ${hour}:${minute}`;
    }

  return (
    <div className={`inner ${darkMode==='darkMode'?BoardCss.dark:null}`}>
        <section className={`${darkMode==='darkMode'?BoardCss.dark:null} ${BoardCss.list}`}>
            <div className={BoardCss.btnWrap}>
                <span onClick={writeHandle}>{userData ? `${userData.username}님, `: null }무슨생각을 하고 계신가요?</span>
            </div>
            <ul>
                {
                    isLoading? 'loading':
                    (posts.map((post, index)=>
                        (
                            <li key={index}>
                                <div className={BoardCss.top}>
                                    <div className={BoardCss.name}>
                                        <h4>{post.username}</h4>
                                        <p>{formatDateTime(post.created_at)}</p>
                                    </div>
                                    {
                                        userData && (post.user_id === userData.user_id ) && 
                                        (<span onClick={()=>deleteHandle(post.post_id)}><md-icon>close</md-icon></span>)
                                    }
                                    
                                </div>
                                <div className={BoardCss.content}>
                                    <p>{post.content}</p>
                                    {
                                        post.photo_count === 0 ? null:
                                        (
                                            
                                            <div className={BoardCss.imgWrap}>
                                                {imgFilter(post.post_id).map((img, index)=>(
                                                    <img src={img.img_url} key={index}/>
                                                ))}
                                            </div>
                                        )
                                    }
                                    
                                </div>
                            </li>
                    )))
                }
                
            </ul>
        </section>
        <Write
            write={write}
            setWrite={setWrite}
            setPosts={setPosts}
            setPhotos={setPhotos}
            setIsLoading={setIsLoading}
            loadingURL={loadingURL}
        />
    </div>
  )
}

export default Board
