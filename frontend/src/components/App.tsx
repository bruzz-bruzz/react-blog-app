import './App.css'
import {useParams,useNavigate} from 'react-router-dom'
import {useState,useEffect} from 'react'
import Toast from './Toast'
export default function App(){
  const par = useParams()
  const nav = useNavigate()
  return (
    <div className='flex justify-center items-center font-mono text-slate-500'>
      <div>

      </div>
    </div>
  )
}