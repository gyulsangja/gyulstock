import axios from 'axios';
import React, {useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/auth/auth';
import loginCss from '../styles/Login.module.css'

const INITIAL_STATE = {
  username: "",
  useremail: "",
  userpwd: "",
};

const Register = () => {
    const [userData, setUserData] = useState(INITIAL_STATE)
    const isLogin = useSelector(state => state.authData.isLogin)
    const loginData = useSelector(state => state.authData.user)
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const useremailRef = useRef();

    const handleSubmit= (e)=>{
        e.preventDefault();
    }

    const handleChange = (event) => {
        setUserData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleReset = () => {
        
        document.getElementById('username').value = '';
        document.getElementById('userpwd').value = '';
        document.getElementById('useremail').value = '';
        useremailRef.current.focus();
    };

      const handleLogin = ()=>{
        axios.post('http://localhost:3500/register', userData)
            .then((res)=>{
                if(res.data.success === true){
                    const resultData = {
                        userData: {
                            user_id: res.data.data.user_id,
                            username: res.data.data.username,
                            useremail: res.data.data.useremail 
                        },
                        interestedStocks: []
                    };
                    dispatch(login(resultData));
                    Navigate('/board')
                }else{
                    new Error(res.data.data)
                }
            }).catch((err)=>Navigate('/register'))
      }
  return (
    <div className={loginCss.login}>
      

        {
        isLogin ?
        <div className={`inner ${loginCss.welcome}`}>
          <h3>{loginData.username}님 반갑습니다.</h3>
        </div>
        :
        <div className={`inner ${loginCss.logout}`}>
          <h1>간단하게 가입하쇼</h1>
          <hr/>
        <form onSubmit={handleSubmit}>
            
            <input
                ref={useremailRef}
                type='email'
                name='useremail'
                placeholder='이메일을 입력하세요'
                onChange={handleChange}
                required
                id='useremail' 
            />
            <input
                type='text'
                name='username'
                placeholder='별명을 입력하세요'
                onChange={handleChange}
                required 
                id='username'
            />
            <input
                type='password'
                name='userpwd'
                placeholder='비밀번호를 입력하세요'
                onChange={handleChange}
                required 
                id='userpwd'
            />
            <div className={loginCss.btn}>
                <button onClick={handleLogin}>회원가입</button>
                <button onClick={handleReset}>취소</button>
            </div>
            
        </form>
        </div>
        }
    </div>
    
  )
}

export default Register
