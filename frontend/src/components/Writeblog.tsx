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
async function verify(){
    const res = await axios.post(`$P{import.meta.env.VITE_BACKEND_URL}/user/verify`,{
      uuid:par.uuid
    })
    if(res.data.ok === false){
      nav('/login')
    }
  }
  async function addBlog(){
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/data/addBlog`,{
        uuid:par.uuid,
        title:title,
        data:data
    })
    setToast({message:res.data.message,ok:res.data.ok})
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
  },[])
    return (
        <div>
            <div className='flex justify-center items-center font-mono text-slate-500'>
                <p>Write a blog!</p>
                <form>
                    <div>
                        <label htmlFor='title'>Title:</label>
                        <input type='text' id='title' value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor='data'>Content:</label>
                        <textarea id='data' rows={15} className='w-9/10' value={data} onChange={(e) => setData(e.target.value)} />
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