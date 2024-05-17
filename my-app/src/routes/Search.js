import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchCss from '../styles/Search.module.css';
import { useSelector } from 'react-redux';

const Search = () => {
  const loadDb = useSelector((state) => state.stockData);
  const darkMode = useSelector((state)=>state.darkMode)
  const [inputValue, setInputValue] = useState('');
  const [filterDB, setFilterDB] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const inputChangeHandle = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const findData = () => {
      const filteredData = loadDb.filter((data) =>
      data.itmsNm.toString().includes(inputValue)
      );
      setFilterDB(filteredData);
      if(filteredData.length === 0){
        setShowMore(false)
      }
      
    };
    findData();
  }, [inputValue, loadDb]);

  const handleShowMore = () => {
    setShowMore(true);
};

  return (
    <div className='wrapper' data-aos="fade-up">
      <div className={SearchCss.search}>
        <input type='text' placeholder='Search' onChange={inputChangeHandle} />
      </div>
      <div className='inner'>
      <ul className={`${SearchCss.result} mt50 ${darkMode==='darkMode'?SearchCss.dark:null}`}>
        {
          filterDB.slice(0, showMore ? undefined : 15).map((data, index)=>{
            return(
              <li key={index}>
                <Link to={`/stock/${data.isinCd}`}>
                <h4>{data.itmsNm}</h4>
                <p className={data.fltRt > 0 ? SearchCss.red:SearchCss.blue}><span>{Number(data.clpr).toLocaleString()}</span>({Number(data.fltRt).toFixed(2)}%)</p>
                <p>{Number(data.trqu).toLocaleString()}</p>
                </Link>
              </li>
            )
          })
          
        }
        {!showMore && filterDB.length > 15 && <button onClick={handleShowMore} className={SearchCss.more}>더보기</button>}
      </ul>
      
      </div>
    </div>
  );
};

export default Search;