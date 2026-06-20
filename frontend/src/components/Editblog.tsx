import './App.css'
import axios from 'axios'
import {useEffect,useState} from 'react'
import {useParams,useNavigate} from 'react-router-dom'
import Toast from './Toast'
export default function Editblog(){
    const par = useParams()
    const nav = useNavigate()
    const [toast,setToast] = useState<{message:string,ok:boolean}>({message:"",ok:false})
    const [title,setTitle] = useState<string>("")
    const [text,setText] = useState<string>("")
    async function verify(){
    const res = await axios.post(`$P{import.meta.env.VITE_BACKEND_URL}/user/verify`,{
      uuid:par.uuid
    })
    if(res.data.ok === false){
      nav('/login')
    }
  }
    async function getBlogData(){
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/getBlogs`,{
            withCredentials:true,
            blogid:par.blogid
        })
        setTitle(res.data.data.title)
        setText(res.data.data.data)
    }
    async function submitChanges(){
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/editBlog`,{
            withCredentials:true,
            title:title,
            data:text,
            uuid:par.uuid
        })
        setToast({message:res.data.message,ok:res.data.ok})
        setTimeout(()=>{
            setToast({message:"",ok:false})
            nav(`/app/${par.uuid}`)
        },3000)
    }
    useEffect(()=>{
        verify()
        getBlogData()
    },[])
    return (
        <div className='font-mono'>
            <div className='flex justify-center items-center flex-col'>
                {title.length > 0 && text.length > 0 && (
                    <div className='flex justify-center items-center flex-col'>
                        <form>
                            <label htmlFor='title'>Title: </label>
                            <input type='text' value={title} onChange={(e)=>setTitle(e.target.value)} className='border border-black rounded-lg p-2'/>
                            <label htmlFor='text'>Blog content: </label>
                            <input type='text' value={text} onChange={(e)=>setText(e.target.value)} className='border border-black rounded-lg p-2'/>
                            <button onClick={()=>submitChanges()} className='border border-black rounded-lg p-2 hover:underline'>Make changes</button>
                        </form>
                    </div>
                )}
            </div>
            {toast.message.length > 0 && (
                <Toast message={toast.message} ok={toast.ok} />
            )}
        </div>
    )
}