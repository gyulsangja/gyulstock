import axios from 'axios';
import React, {useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/auth/auth';
import loginCss from '../styles/Login.module.css'

const INITIAL_STATE = {
    useremail: "",
    userpwd: "",
};

const Login = () => {
    const [userData, setUserData] = useState(INITIAL_STATE)
    const isLogin = useSelector(state => state.authData.isLogin)
    const loginData = useSelector(state => state.authData.user)
    const interestedStocksData = useSelector(state => state.authData.interestedStocks)
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
        document.getElementById('userpwd').value = '';
        document.getElementById('useremail').value = '';
        useremailRef.current.focus();

    };

      const handleLogin = ()=>{
        axios.post('http://49.50.165.24:3000/login', userData)
            .then((res)=>{
                console.log(res.data)
                if(res.data.success){
                    const resultData = {
                        userData: {
                            user_id: res.data.data.user_id,
                            username: res.data.data.username,
                            useremail: res.data.data.useremail 
                        },
                        interestedStocks: res.data.data.interestedStocks
                    };
                    console.log(resultData)
                    dispatch(login(resultData));
                    Navigate(-1)
                }else{
                    new Error('다시 로그인하세요.')
                }
            }).catch((err)=>Navigate('/login'))
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
                type='password'
                name='userpwd'
                placeholder='비밀번호를 입력하세요'
                onChange={handleChange}
                required 
                id='userpwd'

            />
            <div className={loginCss.btn}>
                <button onClick={handleLogin}>로그인</button>
                <button onClick={handleReset}>취소</button>
                <Link to='/register'>간단가입</Link>
            </div>
            <p>email: test@test.co.kr / pwd: test</p>
            
        </form>
        </div>
        }
    </div>
    
  )
}

export default Login
