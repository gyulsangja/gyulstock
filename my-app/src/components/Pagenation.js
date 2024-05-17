import React from 'react'
import PagenationCss from '../styles/Pagenation.module.css'
import '@material/web/icon/icon.js';
import { useSelector } from 'react-redux';

const Pagenation = ({length, pagePerCount, setCurrentPage, currentPage}) => {
    const darkMode = useSelector((state)=>state.darkMode)
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(length / pagePerCount); i++){
        pageNumbers.push(i)
        
    }
    const maxButtons = 6;
    const startIndex = Math.max(0, currentPage - Math.floor(maxButtons / 2));
    const endIndex = Math.min(pageNumbers.length, startIndex + maxButtons);

    const displayedPageNumbers = pageNumbers.slice(startIndex, endIndex);
  return (
    <div className={`${PagenationCss.pagenation} ${darkMode==='darkMode'?PagenationCss.dark:null}`}>
        <button
            className={PagenationCss.firstPageBtn}
            onClick={() => setCurrentPage(1)}
            style={{ display: currentPage === 1 ? 'none' : 'inline' }}
        >
            <md-icon>first_page</md-icon>
        </button>
        <button 
            className={PagenationCss.prevBtn}
            style={
                currentPage === pageNumbers[0] ? {display: "none"} : {display: "inline"}
            }
            onClick={()=>setCurrentPage(currentPage - 1)}
        ><md-icon>arrow_back_ios</md-icon>
        </button>
        {displayedPageNumbers.map((item) => (
                <button
                    key={item}
                    onClick={() => setCurrentPage(item)}
                    className={item === currentPage ? PagenationCss.active : null}
                >
                    {item}
                </button>
            ))}
        <button
            className={PagenationCss.nextBtn}
            onClick={()=>{setCurrentPage(currentPage +1)}}
            style={
                currentPage === pageNumbers[pageNumbers.length - 1] ? {display: "none"} : {display: "inline"}
            }
        ><md-icon>arrow_forward_ios</md-icon>
        </button>
        <button
            className={PagenationCss.lastPageBtn}
            onClick={() => setCurrentPage(pageNumbers.length)}
            style={{ display: currentPage === pageNumbers[pageNumbers.length - 1] ? 'none' : 'inline' }}
        >
            <md-icon>last_page</md-icon>
        </button>
    </div>
  )
}

export default Pagenation
