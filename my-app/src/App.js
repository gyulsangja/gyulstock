import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Home, Search, Domestic, Stock,Board, NotFound, Register, Login,Like } from './routes';
import { Header } from './components';
import logoImg from './assets/logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { storeDatas } from './store/stockData/stockData';
import AOS from 'aos';
import 'aos/dist/aos.css';


function App() {
  AOS.init();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.darkMode);

  const fetchData = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data.response.body.items.item;
    } catch (error) {
      throw new Error('데이터를 불러오는데 오류가 발생했습니다.');
    }
  };
  
  const axiosHandle = async () => {
    let currentDate = getYesterdayDate();
  
    try {
      while (true) {
        const dataGet = await fetchData(getUrl(currentDate));
        if (dataGet.length === 0) {
          currentDate = getPreviousDate(currentDate);
        } else {
          dispatch(storeDatas(dataGet));
          setIsLoading(false);
          setError(null);
          return;
        }
      }
    } catch (error) {
      console.error('에러 발생:', error.message);
      setError('데이터를 불러오는데 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const getYesterdayDate = () => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const getPreviousDate = (date) => {
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    const currentDate = new Date(`${year}-${month}-${day}`);
    currentDate.setDate(currentDate.getDate() - 1);
    const newYear = currentDate.getFullYear();
    const newMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const newDay = String(currentDate.getDate()).padStart(2, '0');
    return `${newYear}${newMonth}${newDay}`;
  };

  const getUrl = (date) => {
    return `https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?serviceKey=Pe8uO3R%2FxmkjjxTF%2BSV7p34FtcR2yYfUeRJEtoU9UV0U2T8tiYKLBo2B8qGxAfKC3YODtcD5CZo%2FA2AUR9ECug%3D%3D&resultType=json&numOfRows=10000&pageNo=1&basDt=${date}`;
    
  };

  useEffect(() => {
    axiosHandle();
  }, []);

  return (
    <BrowserRouter>
      {error && <p className='error'>{error}</p>}
      {isLoading ? (
        <div className='loading'>
          <img src={logoImg} alt='Loading' />
          <h3>gyul stock</h3>
          <p>loading...</p>
        </div>
      ) : (
        <>
          <Header />
          <div className={`container ${darkMode === 'darkMode' ? 'dark': null}`}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/search' element={<Search />} />
              <Route path='/domestic' element={<Domestic />} />
              <Route path='/stock/:id' element={<Stock />} />
              <Route path='/board' element={<Board/>}/>
              <Route path='/like' element={<Like/>}/>
              <Route path='/register' element={<Register />}/>
              <Route path='/login' element={<Login />}/>
              <Route path='*' element={<NotFound/>}/>
            </Routes>
          </div>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;