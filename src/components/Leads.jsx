import React from 'react';

function Leads({leads, toggleCard}) {
        return ( 
            <>
                <div onClick={() => toggleCard(leads.id)} className={
                        `flex flex-auto flex-row transition ease-in-out delay-75 flex-nowrap h-16 items-center
                        bg-white text-black w-full gap-x-1 select-none hover:bg-cyan-400`
                    }>

                    <div className='w-1/3  text-center cursor-pointer  hover:text-white uppercase font-medium'>{leads.leadName}</div>
                    <div className='w-1/3  text-center cursor-pointer  hover:text-white uppercase'>{leads.id}</div>
                    <div className='w-1/3  text-center cursor-pointer  hover:text-white uppercase'>{leads.price}</div>
                </div>
            </>
        );
}

export default Leads;