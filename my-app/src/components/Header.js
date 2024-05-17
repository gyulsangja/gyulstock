import React, { useState } from 'react'
import HeaderCss from '../styles/Header.module.css'
import logoImg from '../assets/logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import '@material/web/icon/icon.js';
import { darkModeChange } from '../store/darkModeSlice/darkModeSlice'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/auth/auth';

const Header = () => {
  const darkMode = useSelector((state)=> state.darkMode)
  const isLogin = useSelector((state)=> state.authData.isLogin)
  const dispatch = useDispatch()
  const Navigate = useNavigate()

  const logoutHandle = ()=>{
    dispatch(logout());
    Navigate('..')
  }

  const [navOn, setNavOn] = useState();
  const navView = ()=>{
    navOn == null ? setNavOn('on') : setNavOn();
  }
  return (
    <header className={`${HeaderCss.header} ${darkMode ==='darkMode'?HeaderCss.dark:null}`}>
      <div className={HeaderCss.mo_header}>
        <div className={HeaderCss.menu_btn}><span onClick={navView}><md-icon>apps</md-icon></span></div>
        <div className={HeaderCss.search_btn}>
          <Link to={'/search'}><md-icon>search</md-icon></Link>
        </div>
      </div>
      <nav className={navOn == 'on' ?  HeaderCss.on : null}>
        <ul>
          <li>
            <Link to={'/'}>
              <div className={HeaderCss.img_wrap}><img src={logoImg} /></div>
              <p>Home</p>
            </Link>
          </li>
          <li>
            <Link to={'/domestic'}>
              <md-icon>monitoring</md-icon>
              <p>증시현황</p>
            </Link>
          </li>
          <li>
            <Link to={'/board'}>
              <md-icon>diversity_3</md-icon>
              <p>커뮤니티</p>
            </Link>
          </li>
          <li>
            <Link to={isLogin? '/like' : '/login'}>
              <md-icon>star</md-icon>
              <p>관심종목</p>
            </Link>
          </li>
          {
            isLogin ? 
            <li onClick={logoutHandle}>
              <a>
                <md-icon>logout</md-icon>
                <p>로그아웃</p>
              </a>
            </li>
            : '' 
            
          }
        </ul>
        <div className={HeaderCss.dark_mode}>
            <span onClick={()=>{dispatch(darkModeChange())}}>
              <md-icon>{darkMode === 'lightMode' ? 'dark_mode' : 'light_mode'}</md-icon>
            </span>
        </div>
      </nav>
    </header>
  )
}

export default Header
