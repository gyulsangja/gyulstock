import React, { useState } from 'react'
import DomesticCss from '../styles/Domestic.module.css'
import { useSelector } from 'react-redux'
import {Pagenation} from '../components'
import { Link } from 'react-router-dom'

const Domestic = () => {
    const loadDb = useSelector((state)=>state.stockData)
    const darkMode = useSelector((state)=>state.darkMode)
    const [marketCate, setMarketCate] = useState('전체')
    const [stockDb, setStockDb] = useState(loadDb)
    const [orders, setOrders] = useState([
        {
            title: "거래가격",
            val: 'clpr',
            sort: null
        },
        {
            title: "등락률",
            val: 'fltRt',
            sort: null
        },
        {
            title: "거래량",
            val: 'trqu',
            sort: null
        }
    ])

    //카테고리
    const cateChange = () => {
        let handleDb;
        if (marketCate === '전체') {
            setMarketCate('KOSDAQ');
            handleDb = loadDb.filter(stock => stock.mrktCtg === 'KOSDAQ');
        } else if (marketCate === 'KOSDAQ') {
            setMarketCate('KOSPI');
            handleDb = loadDb.filter(stock => stock.mrktCtg === 'KOSPI');
        } else if (marketCate === 'KOSPI') {
            setMarketCate('KONEX');
            handleDb = loadDb.filter(stock => stock.mrktCtg === 'KONEX');
        } else {
            setMarketCate('전체');
            handleDb = loadDb;
        }
    
        setStockDb(handleDb);
    
        const updatedOrders = orders.map(order => ({ ...order, sort: null }));
        setOrders(updatedOrders);
    };

    

    const sortStock = (val, sort, idx) => {
        return () => {
            const updatedOrders = orders.map((order, index) => {
                if (index !== idx) {
                    return {
                        ...order,
                        sort: null
                    };
                } else {
                    return {
                        ...order,
                        sort: order.sort === 'desc' ? 'asc' : 'desc'
                    };
                }
            });
            setOrders(updatedOrders);
            const sortedStockDb = [...stockDb].sort((a, b) => {
                let aValue = parseFloat(a[val]);
                let bValue = parseFloat(b[val]);
                if (updatedOrders[idx].sort === 'asc') {
                    return aValue - bValue;
                } else if (updatedOrders[idx].sort === 'desc') {
                    return bValue - aValue;
                }
                return 0;
            });
            setStockDb(sortedStockDb);
        };
    };

    //기준날짜
    const basDt = loadDb[0].basDt;
    const year = basDt.substring(0, 4);
    const month = basDt.substring(4, 6);
    const day = basDt.substring(6, 8);
    const formattedDate = `${year}.${Number(month)}.${Number(day)}`;

    // pagenation
    const [pagePerCount, setPagePerCount] = useState(15)
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLast = currentPage * pagePerCount
    const indexOfStart = indexOfLast - pagePerCount;
    const currentStock = stockDb.slice(indexOfStart, indexOfLast)

  return (
    <div className={`wrapper`} data-aos="fade-up">
        <div className={`${DomesticCss.subTit} subTit`}>
            <h2>증시현황</h2>
        </div>
        <div className='inner'>
        <p className={DomesticCss.date}>기준일자: {formattedDate}</p>
        <div className={`${DomesticCss.table_wrap} ${darkMode === 'darkMode'? DomesticCss.dark:null}`}>
            <div className={DomesticCss.table_wrap2}>
                <table>
                    <thead>
                        <tr>
                            <th onClick={cateChange}>{marketCate}</th>
                            {
                                orders.map((order, index)=>
                                    <th key={index} onClick={sortStock(order.val, order.sort, index)}>{order.title}<md-icon>{order.sort === 'desc' ? 'arrow_drop_down' : (order.sort === 'asc' ? 'arrow_drop_up' : null)}</md-icon></th>
                                )
                            }
                        </tr>
                    </thead>
                    <tbody>
                    {
                        currentStock.map((stock, index)=>(
                            <tr key={index}>
                                <td><Link to={'/stock/' + stock.isinCd}>{stock.itmsNm}</Link></td>
                                <td>{Number(stock.clpr).toLocaleString()}</td>
                                <td className={stock.fltRt < 0 ? DomesticCss.blue:DomesticCss.red}>{Number(stock.fltRt).toFixed(2)}%</td>
                                <td>{Number(stock.trqu).toLocaleString()}</td>
                            </tr>    
                        ))

                        
                    }
                    </tbody>
                </table>
            </div>
        </div>
        <Pagenation
            length={stockDb.length}
            pagePerCount={pagePerCount}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
        />
        </div>
    </div>
  )
}

export default Domestic
