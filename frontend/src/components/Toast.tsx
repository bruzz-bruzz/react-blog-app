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
                    setTimeout(()=>{
                    setTimeLeft(timeLeft - 100)
                    if(timeLeft <= 0){
                        setHide(true)
                    }
                },100) 
        }
    }
    useEffect(()=>{
        countdown()
    },[])   
    return(
        <div className={`rounded-full p-2 absolute bottom-4 right-4 font-mono ${ok === false ? 'bg-red-300' : 'bg-green-300'} ${hide === false ? 'visible' : 'invisible'}`}>
            {message}
            <div className="w-full bg-neutral-quaternary rounded-full h-2">
            <div className={`bg-green-600 bg-brand h-2 rounded-full w=${(timeLeft / 3000) * 100}`}></div>
            </div>
        </div>
    )
}