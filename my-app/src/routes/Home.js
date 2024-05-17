import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import HomeCss from '../styles/Home/Home.module.css'
import { Ranking, CateRanking } from '../components';
import { useSelector } from 'react-redux';
import sec3Img from '../assets/sec3_bg.jpg'

const Home = () => {
  const [fullScreen, setFullScreen] = useState(true);
  const darkMode = useSelector((state)=>state.darkMode)

  const fullScreenHandle = () => {
    setFullScreen(false);
    setTimeout(() => {
      window.scrollTo({
        top: document.getElementById('sec').offsetTop,
        behavior: 'smooth' 
      });
    }, 150);
  };

  return (
    <div data-aos="fade-up">
      <main className={`${HomeCss.main} ${fullScreen === true ? HomeCss.full: null} ${darkMode === 'darkMode' ? HomeCss.dark: null}`} >
          <section
            className={`
              ${HomeCss.sec1} ${HomeCss.background} ${fullScreen === true ? HomeCss.full: null}
            `}>
            <h1>gyulgyul stock</h1>
            <span onClick={fullScreenHandle}>START</span>
          </section>

          <div id='sec'></div>
          <div className='mt60'></div>

          <div className={`inner ${HomeCss.secWrap} ${fullScreen === true ? HomeCss.full: null}`} >
            <Ranking/>
            <CateRanking/>
            <section className={`${HomeCss.sec3} mt50`}>
              <figure>
                <figcaption>
                  <h4><span>귤귤주식</span>과 함께</h4>
                  <p>시장동향을 확인하세요</p>
                  <Link to={'/domestic'}>바로가기</Link>
                </figcaption>
                <img src={sec3Img}/>
              </figure>
            </section>
          </div>
          
      </main>
    </div>
  )
}

export default Home
