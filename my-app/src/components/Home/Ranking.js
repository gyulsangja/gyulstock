import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react';
import RankingCsss from '../../styles/Home/Ranking.module.css'
import '@material/web/icon/icon.js';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../styles/Home/HomeSwiper.css'
import { Link } from 'react-router-dom';


const Ranking = () => {
  const darkMode = useSelector((state)=>state.darkMode)
  const loadDb = useSelector((state)=>state.stockData)
  const [stockDb, setStockDb] = useState(loadDb)
  const [ranking, setRangking] = useState([
    {
      id: 0,
      title: "상승률",
      val: 'fltRt',
      sort: 'desc'
    },
    {
      id: 1,
      title: "하락률",
      val: 'fltRt',
      sort: 'asc'
    },
    {
      id: 2,
      title: "거래량",
      val: 'trqu',
      sort: 'desc'
    }
  ])
  
  const sliceDb = (idx) => {

    let sortedDb = [...loadDb];
  
    if (idx === 0) {
      sortedDb.sort((a, b) => b.fltRt - a.fltRt);
    } else if (idx === 1) {
      sortedDb.sort((a, b) => a.fltRt - b.fltRt);
    } else if(idx === 2) {
      sortedDb.sort((a, b) => b.trqu - a.trqu);
    }
    
    // 잘라내기
    return sortedDb.slice(0, 5);
  };

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + ranking[index].title + '</span>';
    },
  };
  return (
    <section  className={`${RankingCsss.sec2} ${RankingCsss.sec} mt50 ${darkMode === 'darkMode' ? RankingCsss.dark:null} `} id='sec'>
        <h3>종합 종목 랭킹</h3>
        <Swiper
          pagination={pagination}
          modules={[Pagination]}
          className="mySwiper"
        >
          {
            ranking.map((data, index)=>(
              <SwiperSlide key={index}>
                <ol>
                  {sliceDb(data.id).map((item, idx) => ( // sliceDb 함수 호출 수정
                    <li key={idx}>
                      <div className={RankingCsss.idx}>{idx + 1}</div>
                      <h4><Link to={`/stock/${item.isinCd}`}>{item.itmsNm}</Link></h4>
                      <div className={`${item.fltRt > 0 ? RankingCsss.red:RankingCsss.blue} ${RankingCsss.arrow}`}>
                        <md-icon>{item.fltRt > 0 ? 'arrow_drop_up' : 'arrow_drop_down'}</md-icon>
                      </div>
                      <div className={RankingCsss.detail}>
                        <h5 className={item.fltRt > 0 ? RankingCsss.red:RankingCsss.blue}>
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

export default Ranking
