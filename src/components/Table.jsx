import React from 'react'
import { useState, useEffect } from 'react'
import Leads from './Leads'
import Header from './Header'
import Card from './Card'
const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjA2ZmEwYWNiZmUwYzg5ZjdhNzY3ZWFmNGU4ZjViZjU4Y2NhNjNiMDE2MDcxZjRkOTY4NDhmYjRlZTJiNGU4MTI2M2YyYmYyNGNhOGVkODc1In0.eyJhdWQiOiIxYWY3YWZlMy02MzBhLTRhMWItODJhNy1iNzlhM2QzMTQ2YzMiLCJqdGkiOiIwNmZhMGFjYmZlMGM4OWY3YTc2N2VhZjRlOGY1YmY1OGNjYTYzYjAxNjA3MWY0ZDk2ODQ4ZmI0ZWUyYjRlODEyNjNmMmJmMjRjYThlZDg3NSIsImlhdCI6MTcyODE1MDUxMSwibmJmIjoxNzI4MTUwNTExLCJleHAiOjE3MjgyMzY5MTEsInN1YiI6IjExNTgxNjU0IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxOTc5MjMwLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiY2M3NjAyZmUtNDU2Ni00Yzc1LTlkNGYtYzFlMDUxM2NhMjY0IiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.IvKIFVS0rftnC8tNcDI5fjALg3K0yToWRHRgbsGuSYbBMlDMpSRtrCEUfNsx7IMPSu5UPMNKYMO238eTsCIUBAO3i64CjVsusO2617-mrLu0TQ_EM4TXT7OE3d5Tg7aJIp4G09GqWROUWAqgL9dh6crZvjiIZ59-D3-CD0tUQImU8Ps0oYfkK-HJOUJs1sMm3YQJyLC-JR7Y4w4h6GFcyMiDjTzrwY_dRYmMzPUSK07aWqM1tpyImGdomrrTO0yAtqEyQuG9oy4lFEMFO7kyddEcvob41Qtuumu5T0TmVq0qoDueJ3kxCAvPqq4EiobyxNBGzzFh6qb5g-Tv4LUWpA'
let index = 0
let cardsIds = []
let leadsList = []
let tasks = []

async function getTasks() { //получаем список задач и сохраняем в переменной tasks
    let data = await fetch(`https://artgeerkh.amocrm.ru/api/v4/tasks`, {
        method: 'GET',
            headers: {
              'Authorization': `Bearer ${ACCESS_TOKEN}`,
              'Content-Type': 'application/hal+json'
            }
          })
    tasks = await data.json()
}
getTasks()

/*
taskCompleteTill - временная метка в миллисекундах, является значением свойства объекта задачи (tasks)
данная функция сравнивает полученную временную метку с текущим временем, и возвращает цвет статуса в соответствии
*/
function isTaskTimePassed(taskCompleteTill) { 
    const currentTime = Math.floor(Date.now() / 1000)
    if(taskCompleteTill < currentTime){
        return 'red'
    } else if(taskCompleteTill > currentTime + 86400){
        return 'yellow'
    } else {
        return '#90EE90'
    }
}

function getCardsIds() { //получаем список сделок и сохраняем их id в переменной  cardsIds
    let leadsUrl = 'https://artgeerkh.amocrm.ru/api/v4/leads'
    fetch(leadsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res =>{
        let leads = res.json()
        return leads
      })
      .then(res => {
        res._embedded.leads.map(i => cardsIds = [...cardsIds, i.id])
      })
      .catch(err => {
        console.log(err)
      })
}
getCardsIds()


async function getCards(slicedArrayOfCards) { //Получаем промисом массив из найденных сделок по данным айдишникам и сохраняем его в переменной leadsList
    let cardListById = await Promise.all(slicedArrayOfCards.map(async(i) => {
        let leadsUrl = `https://artgeerkh.amocrm.ru/api/v4/leads/${i}`
        let data = await fetch(leadsUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${ACCESS_TOKEN}`,
              'Content-Type': 'application/hal+json'
            }
          })
        
        try {
            let leads = await data.json()
            return leads
        } catch(error) {
            console.error('Ошибка запроса', error)
        }
    }))

    leadsList = [...cardListById, ...leadsList]
}

function Table() {
    const [leads, setLeads] = useState([])
    const [openCard, setOpenCard] = useState(null) //состояние следит за открытими/закрытыми карточками

    const toggleCard = (id) => {
        setOpenCard(openCard === id ? null : id)
    }

    function formatDate(date) { //форматируем дату для отображения в таблице
        console.log(date)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
      
        return `${day}.${month}.${year}`
    }

/*
Каждую сек. берем по 3 сделки и добавляем их в состояние leads
*/
    useEffect(() => {
        const interval = setInterval(() => {
            if (index > cardsIds.length) {
                return () => clearInterval(interval)
            }

            const idsToFetch = cardsIds.slice(index, index + 3)

            getCards(idsToFetch) //функция getCards сформирует массив сделок с переданными id в переменной leadsList

            .then(() => {
                setLeads([...leads, ...leadsList])
            })

            .catch(err => {
                console.error(`Произошла ошибка установки состояния setLeads ${err}`)
            })

            index += 3
        }, 1000)
      }, [])

        return (
            <>
            <Header/>
            <div className="h-dvh flex items-start justify-center bg-bgDark pt-6 pb-6">
                <div className="grid grid-flow-row gap-1 w-3/4 place-items-center row-span-4">
                    <div className='flex flex-auto flex-row flex-nowrap bg-cyan-500 w-full select-none text-white font-extrabold'>
                        <div className='w-1/3 uppercase text-center'>название</div>
                        <div className='w-1/3 uppercase text-center'>id</div>
                        <div className='w-1/3 uppercase text-center'>бюджет</div>
                    </div>
                    {leads.map((lead) => {
                        //console.log(lead)
                        let findEntity = tasks._embedded.tasks.filter(elem => elem.entity_id === lead.id) //поиск связанной задачи для текущей сделки
                        let checkStatus = isTaskTimePassed(findEntity[0].complete_till) //проверка статуса задачи

                        return (
                        <>
                         <Leads leads={{id: lead.id, leadName: lead.name, price: lead.price}} toggleCard={toggleCard}/>
                            {openCard === lead.id && (
                                <Card card={{id: lead.id, leadName: lead.name, created_at: lead.created_at}} formatDate={formatDate} checkStatus={checkStatus}/>
                            )}
                        </>
                    )})}
                </div>
            </div>
            </>
        )
    }

export default Table;