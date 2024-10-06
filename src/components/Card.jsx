import React from 'react';

function Card({card, formatDate, checkStatus}) {
//console.log(card)
    return ( 
        <div className={`flex flex-auto flex-row flex-wrap bg-bgDark text-white w-full select-none justify-around`}>
            <span className='uppercase text-center w-1/2 p-5 border-b-2 border-cyan-300'>название:</span>
            <div className='w-1/2  text-center cursor-pointer hover:text-white p-5 border-b-2 border-cyan-300'>{card.leadName}</div>
            <span className='uppercase text-center w-1/2 p-5 border-b-2 border-cyan-300'>id:</span> 
            <div className='w-1/2  text-center cursor-pointer hover:text-white p-5 border-b-2 border-cyan-300'>{card.id}</div>
            <span className='uppercase text-center w-1/2 p-5 border-b-2 border-cyan-300'>дата:</span>
            <div className='w-1/2  text-center cursor-pointer  hover:text-white p-5 border-b-2 border-cyan-300'>{formatDate(new Date(card.created_at))}</div>
            <span className='uppercase text-center w-1/2 p-5 border-b-2 border-cyan-300'>статус:</span> 
            <div className='w-1/2 flex justify-center items-center p-5 border-b-2 border-cyan-300'>
            <svg width="20px" height="20px"> <circle cx="10" cy="10" r="9" stroke={checkStatus} strokeWidth="1" fill={checkStatus}/> </svg>
            </div>
        </div>
     );
}

export default Card;