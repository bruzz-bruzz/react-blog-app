import './App.css'
import {useState,useEffect} from 'react'
type Data = {
    message:string,
    ok:boolean
}
export default function Toast({message,ok}:Data){
    const [hide,setHide] = useState(false)
    function countdown(){
        setTimeout(()=>{
            setHide(true)
        },3000) 
    }
    useEffect(()=>{
        countdown()
    },[])   
    return(
        <div className={`absolute bottom-4 right-4 flex justify-center items-center font-mono ${ok === false ? 'bg-red-300' : 'bg-green-300'} ${hide === false ? 'visible' : 'invisible'}`}>
            {message}
        </div>
    )
}