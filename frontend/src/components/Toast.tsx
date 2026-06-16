import './App.css'
import {useState,useEffect} from 'react'
type Data = {
    message:string,
    ok:boolean
}
export default function Toast({message,ok}:Data){
    const [hide,setHide] = useState(false)
    const [timeLeft,setTimeLeft] = useState(3000)
    function countdown(){
        while(timeLeft > 0){
            const timer = setTimeout(()=>{
                setTimeLeft(timeLeft => timeLeft - 100)
            },100)
            return () => clearTimeout(timer)
        }
        setHide(true)
    }
    useEffect(()=>{
        countdown()
    },[])   
    return(
        <div className={`rounded-full p-2 absolute bottom-4 right-4 font-mono ${ok === false ? 'bg-red-300' : 'bg-green-300'} ${hide === false ? 'visible' : 'invisible'}`}>
            {message}
            <div className="w-full bg-neutral-quaternary rounded-full h-2">
            <div className={`bg-gray-600 bg-brand h-2 rounded-full w=${(timeLeft / 3000) * 100}`}></div>
            </div>
        </div>
    )
}