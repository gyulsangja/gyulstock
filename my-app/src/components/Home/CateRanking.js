import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react';
import CateRankingCss from '../../styles/Home/CateRanking.module.css'
import '@material/web/icon/icon.js';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../styles/Home/HomeSwiper.css'
import { Link } from 'react-router-dom';


const CateRanking = () => {
  const darkMode = useSelector((state)=>state.darkMode)
  const loadDb = useSelector((state)=>state.stockData)
  const [stockDb, setStockDb] = useState(loadDb)
  const [cate, setCate] = useState([
    {
      id: 0,
      title: 'KOSPI'
    },
    {
      id: 1,
      title: 'KOSDAQ'
    },
    {
      id: 2,
      title: 'KONEX'
    }
  ]) 
  
  
  const sliceDb = (title) => {
    const filteredDb = loadDb.filter(stock => stock.mrktCtg === title);
    
    let sortedDb = [...filteredDb];
    sortedDb.sort((a, b) => b.fltRt - a.fltRt);
    
    return sortedDb.slice(0, 5);
  };

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + cate[index].title + '</span>';
    },
  };
  return (
    <section  className={`${CateRankingCss.sec2} ${CateRankingCss.sec} mt50 ${darkMode === 'darkMode' ? CateRankingCss.dark:null} `}>
        <h3>시장별 랭킹</h3>
        <Swiper
          pagination={pagination}
          modules={[Pagination]}
          className="mySwiper"
        >
          {
            cate.map((data, index)=>(
              <SwiperSlide key={index}>
                <ol>
                  {sliceDb(data.title).map((item, idx) => ( // sliceDb 함수 호출 수정
                    <li key={idx}>
                      <div className={CateRankingCss.idx}>{idx + 1}</div>
                      <h4><Link to={`/stock/${item.isinCd}`}>{item.itmsNm}</Link></h4>
                      <div className={`${item.fltRt > 0 ? CateRankingCss.red:CateRankingCss.blue} ${CateRankingCss.arrow}`}>
                        <md-icon>{item.fltRt > 0 ? 'arrow_drop_up' : 'arrow_drop_down'}</md-icon>
                      </div>
                      <div className={CateRankingCss.detail}>
                        <h5 className={item.fltRt > 0 ? CateRankingCss.red:CateRankingCss.blue}>
                          {Number(item.clpr).toLocaleString()} <span>({Number(item.fltRt).toFixed(2)}%)</span>
                          </h5>
                      </div>
                    </li>
                  ))}
                </ol>
              </SwiperSlide>
            ))
          }
        </Swiper>
      </section>
  )
}

export default CateRanking
