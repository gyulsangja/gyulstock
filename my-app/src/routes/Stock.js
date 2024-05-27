import React, { useState, useEffect } from 'react';
import StockCss from '../styles/Stock.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import logoImg from '../assets/logo.svg';
import '@material/web/icon/icon.js';
import { StockChart } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { interestedStocksHandle } from '../store/auth/auth';

const Stock = () => {
    const { id } = useParams();
    const url = `https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?serviceKey=Pe8uO3R%2FxmkjjxTF%2BSV7p34FtcR2yYfUeRJEtoU9UV0U2T8tiYKLBo2B8qGxAfKC3YODtcD5CZo%2FA2AUR9ECug%3D%3D&resultType=json&numOfRows=80&pageNo=1&isinCd=${id}`;

    const navigate = useNavigate();
    const dispatch = useDispatch();  
    const darkMode = useSelector((state)=>state.darkMode);
    const userData = useSelector((state)=>state.authData.user);
    const interestedStocks = useSelector((state)=>state.authData.interestedStocks);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [datas, setDatas] = useState([]);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(url);
                setDatas(response.data.response.body.items.item);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setError('데이터를 불러오는데 오류가 발생했습니다.');
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url]);

    const formattedDate = (date) => {
        const year = date.substring(0, 4);
        const month = date.substring(4, 6);
        const day = date.substring(6, 8);
        return `${year}/${Number(month)}/${Number(day)}`;
    };

    const handleShowMore = () => {
        setShowMore(true);
    };

    const likeHandle = () => {
        if (!userData) {
            navigate('/login')
            return;
        }
        
        const sendData = {
            stock_isinCd: id,
            user_id: userData.user_id
        }
        axios.post('http://49.50.165.24:3000/stock', sendData)
            .then((res) => {
                if (res.data.success) {
                    dispatch(interestedStocksHandle(res.data.data));
                } else {
                    throw new Error('다시 시도하세요.');
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    const isLiked = interestedStocks && Array.isArray(interestedStocks) && interestedStocks.includes(id);

    return (
        <div className='wrapper'>
            <div className='inner'>
            {error && <p className='error'>{error}</p>}
            {isLoading ? (
                    <div className='loading'>
                    <img src={logoImg}/>
                    <h3>gyul stock</h3>
                    <p>loading...</p>
                    </div>
                    
                ) : (
                    <>
                    <section className={StockCss.sec1} data-aos="fade-up">
                        <div className={` ${datas[0].fltRt < 0 ? StockCss.bluebg:StockCss.redbg} ${StockCss.top}`}>
                            <ul>
                                <li>{datas[0].srtnCd}</li>
                                <li>{datas[0].mrktCtg}</li>
                            </ul>
                            {
                                isLiked ? null:
                                <div className={StockCss.btn} onClick={likeHandle}>
                                    <span><md-icon>star</md-icon></span>
                                </div>
                            }
                        </div>
                        <div className={`${darkMode ==='darkMode'?StockCss.dark:null} ${StockCss.tit}`}>
                            <dl>
                                <dt className={datas[0].fltRt < 0 ? StockCss.blue:StockCss.red}>{Number(datas[0].clpr).toLocaleString()}</dt>
                                <dd className={datas[0].fltRt < 0 ? StockCss.blue:StockCss.red}>{Number(datas[0].vs).toLocaleString()}({Number(datas[0].fltRt).toFixed(2)}%)</dd>
                                <dd>{Number(datas[0].trqu).toLocaleString()}</dd>
                            </dl>
                            <div className={StockCss.name}><h3>{datas[0].itmsNm}</h3></div>
                        </div>
                    </section>
                    <section className={`mt50 ${StockCss.sec2} ${darkMode ==='darkMode'?StockCss.dark:null}`}>
                        <div className={StockCss.chartWrap}>
                        <StockChart datas={datas}/>
                        </div>
                    </section>
                    <section className={`mt50 ${StockCss.sec3} ${darkMode ==='darkMode'?StockCss.dark:null}`}>
                        <table>
                            <thead>
                                <tr>
                                    <th>일자</th>
                                    <th>주가</th>
                                    <th>등락률</th>
                                    <th>거래량</th>
                                    <th>시가</th>
                                    <th>고가</th>
                                    <th>저가</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                datas.slice(0, showMore ? undefined : 15).map((data, index) => (
                                    <tr key={index}>
                                        <td>{formattedDate(data.basDt)}</td>
                                        <td className={data.fltRt < 0 ? StockCss.blue:StockCss.red}>{Number(data.clpr).toLocaleString()}</td>
                                        <td  className={data.fltRt < 0 ? StockCss.blue:StockCss.red}>{Number(data.fltRt).toFixed(2)}%</td>
                                        <td>{Number(data.trqu).toLocaleString()}</td>
                                        <td  className={data.fltRt < 0 ? StockCss.blue:StockCss.red}>{Number(data.mkp).toLocaleString()}</td>
                                        <td  className={data.fltRt < 0 ? StockCss.blue:StockCss.red}>{Number(data.hipr).toLocaleString()}</td>
                                        <td  className={data.fltRt < 0 ? StockCss.blue:StockCss.red}>{Number(data.lopr).toLocaleString()}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                        {!showMore && datas.length > 15 && <button onClick={handleShowMore} className={StockCss.more}>더보기</button>}
                    </section>
                    </>  
                )}
            </div>
        </div>
    )
}

export default Stock;