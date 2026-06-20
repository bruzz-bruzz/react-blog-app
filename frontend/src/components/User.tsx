import './App.css'
import axios from 'axios'
import {useParams,useNavigate} from 'react-router-dom'
import {useState,useEffect} from 'react'
import Toast from './Toast'
import Blogcard from './Blogcard'
export default function User(){
    const par = useParams()
    const nav = useNavigate()
    const [toast,setToast] = useState<{message:string,ok:boolean}>({message:"",ok:false})
    const [data,setData] = useState<{email:string,username:string,registereddate:Date}>({email:"",username:"",registereddate:new Date()})
    const [page,setPage] = useState<'USERDATA'|'USERBLOGS'>("USERBLOGS")
    const [batchNumber,setBatchNumber] = useState<number>(1)
    const [blogs,setBlogs] = useState<any>()
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
        setToast({message:res.data.message,ok:res.data.ok})
        setData(res.data.data)
        setTimeout(()=>{
            setToast({message:"",ok:false})
        },3000)
    }
    async function getUserBlogs(){
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/getBlogs`,{
            withCredentials:true,
            uuid:par.uuid,
            userbatchnumber:batchNumber
        })
        setToast({message:res.data.message,ok:res.data.ok})
        setBlogs(res.data.data)
        setTimeout(()=>{
            setToast({message:"",ok:false})
        },3000)
    }
    useEffect(()=>{
        verify()
        getUserData()
        getUserBlogs()
    },[])
    return (
        <div className='font-mono'>
            <div className='w-1/5 flex justify-center items-center'>
                <button className='border border-black rounded-lg p-2' onClick={()=>setPage("USERBLOGS")}>Your blogs</button>
                <button className='border border-black rounded-lg p-2' onClick={()=>setPage("USERDATA")}>Your credentials</button>
            </div>
            {page === 'USERDATA' && (
                <div>
                <div className='flex justify-center items-center flex-col'>
                <h3>Username: {data.username}</h3>
                <h3>Email: {data.email}</h3>
                <h3>Sign-up date: {data.registereddate.toString()}</h3>
            </div>
            <h1 className='border-b border-black'>Edit credentials</h1>
            <div className='grid grid-cols-3 p-4'>
                <button className='hover:underline' onClick={()=>nav(`/changeemail/${par.uuid}`)}>Change email</button>
                <button className='hover:underline' onClick={()=>nav(`/changepassword/${par.uuid}`)}>Change password</button>
                <button className='hover:underline' onClick={()=>nav(`/changeusername/${par.uuid}`)}>Change username</button>
            </div>
            </div>
            )}
            {page === 'USERBLOGS' && (
                <div>
                    <div className='flex justify-center items-center flex-col'>
                        {blogs.map((val:any,idx:any)=>{
                            <Blogcard key={idx} likes={val.likes} editingperms={true}title={val.title} author={val.userid} creationdate={val.createddate} previewData={val.data.slice(0,50) + '...'} blogid={val.id} />
                        })}
                    </div>
                    <div>
                        <button onClick={()=>setBatchNumber(prev=>Math.max(1,prev-1))}>⬅️</button>
                        <p>{batchNumber}</p>
                        <button onClick={()=>setBatchNumber(prev=>prev+1)}>➡️</button>
                    </div>
                </div>
            )}
            {toast.message.length > 0 && (
                <Toast message={toast.message} ok={toast.ok} />
            )}
        </div>
    )
}