import './App.css'
import axios from 'axios'
import {useParams,useNavigate} from 'react-router-dom'
import {useState,useEffect} from 'react'
import Toast from './Toast'
export default function Writeblog(){
    const par = useParams()
    const nav = useNavigate()
    const [title,setTitle] = useState<string>("")
    const [data,setData] = useState<string>("")
    const [toast,setToast] = useState<{message:string,ok:boolean}>({message:"",ok:false})
    const [userData,setUserData] = useState<string>('')
async function verify(){
    const res = await axios.post(`$P{import.meta.env.VITE_BACKEND_URL}/user/verify`,{
      uuid:par.uuid
    })
    if(res.data.ok === false){
      nav('/login')
    }
  }
  async function getUserData(){
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/getUserData`,{
        withCredentials:true,
        uuid:par.uuid
    })
    if(res.data.ok){
        setUserData(res.data.data)
    }
  }
  function validate(){
        if(title.trim().length === 0 || data.trim().length === 0){
            setToast({message:"Empty fields",ok:false})
            setTimeout(()=>{
                setToast({message:"",ok:false})
            },3000)
            return false
        } return true
    }
  async function addBlog(){
    if(!validate()){return}
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/data/addBlog`,{
        uuid:par.uuid,
        title:title,
        data:data
    })
    if(res.data.ok){
        setToast({message:res.data.message,ok:res.data.ok})
    } else {
        setToast({message:'Error occurred',ok:res.data.ok})
    }
    setTimeout(()=>{
        setToast({message:"",ok:false})
    },3000) 
  }
  useEffect(()=>{
    verify()
    getUserData()
  },[])
    return (
        <div>
            <button className='absolute top-5 left-5 hover:underline' onClick={()=>{nav(`/app/${par.uuid}`)}}>Back</button>
            <div className='flex justify-center items-center font-mono text-slate-500'>
                <h4>Hi {userData}#{par.uuid}!</h4>
                <p>Write a blog!</p>
                <form>
                    <div>
                        <label htmlFor='title'>Title:</label>
                        <input type='text' id='title' value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor='data'>Content:</label>
                        <textarea id='data' disabled rows={25} className='w-9/10' value={data} onChange={(e) => setData(e.target.value)} />
                    </div>
                    <button type='button' onClick={addBlog}>Add Blog</button>
                </form>
            </div>
            {toast.message.length > 0 && (
                <Toast message={toast.message} ok={toast.ok} />
            )}
        </div>
    )
}