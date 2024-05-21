import React from 'react'
import { Link } from 'react-router-dom'
import LikeCss from '../styles/LikeCss.module.css'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {interestedStocksHandle} from '../store/auth/auth'

const Like = () => {
    const interestedStocks = useSelector(state=>state.authData.interestedStocks)
    const stockData =useSelector(state=>state.stockData)
    const filteredStockData = stockData.filter(stock => interestedStocks.includes(stock.isinCd));
    const userData = useSelector((state)=>state.authData.user)
    const dispatch = useDispatch();

    const deleteHandle = (isinCd, index) => {
        const sendData = {
            stock_isinCd: isinCd,
            user_id: userData.user_id,
        }
        axios.put(`http://118.67.135.87/like`, sendData)
            .then((res) => {
                if (res.data.success) {
                    dispatch(interestedStocksHandle(res.data.data));  
                } else {
                    console.log('error')
                }
            }).catch((err)=>console.error(err))
    }
    return (
    <div className=' inner'>
        <h2 className={LikeCss.title}>관심종목</h2>
        <ul className={LikeCss.like}>
            {
                filteredStockData.map((item, index)=>{
                    return(
                        <li key={index}>
                            <div className={`${LikeCss.top} ${item.fltRt >= 0 ? LikeCss.redbg : LikeCss.bluebg}`}>
                                <div className={LikeCss.left}>
                                    <span>{item.srtnCd}</span>
                                    <span>{item.mrktCtg}</span>
                                </div>
                                <div className={LikeCss.btn} onClick={()=>{deleteHandle(item.isinCd, index)}}>
                                    <span><md-icon>delete</md-icon></span>
                                </div>
                            </div>
                            <Link to={`/stock/${item.isinCd}`}>
                                <div className={`${LikeCss.content}`}>
                                    <dl>
                                        <dt className={`${item.fltRt >= 0 ? LikeCss.red:LikeCss.blue}`}>{Number(item.clpr).toLocaleString()}</dt>
                                        <dd className={`${item.fltRt >= 0 ? LikeCss.red:LikeCss.blue}`}>{`${Number(item.vs).toLocaleString()} (${Number(item.fltRt).toLocaleString(2)}%)`}</dd>
                                        <dd>{Number(item.trqu).toLocaleString()}</dd>
                                    </dl>
                                    <div className={LikeCss.name}><h3>{item.itmsNm}</h3></div>
                                </div>
                            </Link>
                        </li>
                    )
                })
            }
            
        </ul>
    </div>
  )
}

export default Like
