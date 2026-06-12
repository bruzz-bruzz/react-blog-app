import './App.css'
import {useParams,useNavigate} from 'react-router-dom'
import {useState,useEffect} from 'react'
import Toast from './Toast'
import axios from 'axios'
export default function App(){
  const par = useParams()
  const nav = useNavigate()
  const [userData,setUserData] = useState<{username:string,email:string}>({username:"",email:""})
  const [toast,setToast] = useState<{message:string,ok:boolean}>({message:"",ok:false})
  const [batchNumber,setBatchNumber] = useState<number>(1)
  const [blogs,setBlogs] = useState<any[]>([])
  const [dateOrder,setDateOrder] = useState<"ASC"|"DESC">("DESC")
  async function verify(){
    const res = await axios.post(`$P{import.meta.env.VITE_BACKEND_URL}/user/verify`,{
      uuid:par.uuid
    })
    if(res.data.ok === false){
      nav('/login')
    }
  }
  async function getUserData(){
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/getUserData`,{
            uuid:par.uuid
        })
        if(response.data.ok){
            setUserData({username:response.data.data.username,email:response.data.data.email})   
        }
    }
  async function getBlogs(){
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/data/getBlogs`,{
      uuid:par.id,
      getAll:true,
      order:dateOrder
    })
    setBlogs(res.data.data)
  }
    useEffect(()=>{
        verify()
        getUserData()
        getBlogs()
    },[])
  return (
    <div>
    <div className='flex justify-center items-center font-mono text-slate-500'>
      <div className='flex jusitfy-center items-center flex-col'>
        <p>{userData.username}#{par.uuid}</p>
      </div>
    </div>
    {toast.message.length > 0 && (
      <Toast message={toast.message} ok={toast.ok} />
    )}
    </div>
  )
}