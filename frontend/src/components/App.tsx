import './App.css'
import {useParams,useNavigate} from 'react-router-dom'
import {useState,useEffect} from 'react'
import Toast from './Toast'
import Blogcard from './Blogcard'
import axios from 'axios'
export default function App(){
  const par = useParams()
  const nav = useNavigate()
  const [userData,setUserData] = useState<{username:string,email:string}>({username:"",email:""})
  const [toast,setToast] = useState<{message:string,ok:boolean}>({message:"",ok:false})
  const [batchNumber,setBatchNumber] = useState<number>(1)
  const [blogs,setBlogs] = useState<any[]>([])
  const [dateOrder,setDateOrder] = useState<"ASC"|"DESC">("DESC")
  const [search,setSearch] = useState<string>('')
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
      order:dateOrder,
      batchnumber:batchNumber
    })
    setBlogs(res.data.data)
  }
  function searchByTitle(){
    let tmp = []
    for(let i = 0; i < blogs.length; i++){
      if(blogs[i].title.startsWith(search)){
        tmp.push(blogs[i])
      }
    }
    setToast({message:`Found ${tmp.length} results`,ok:true})
    setTimeout(()=>{
      setToast({message:"",ok:false})
    },3000)
    setBlogs(tmp)
  }
    useEffect(()=>{
        verify()
        getUserData()
        getBlogs()
    },[])
  return (
    <div>
    <div className='flex justify-center items-center font-mono text-slate-500'>
      <div className='grid grid-cols-3 lg-4 p-2 space-y-4'>
        <div className='border border-black rounded-lg p-2'>
          <p>{userData.username}#{par.uuid}</p>
        </div>
        <div>
            <input className='p-2 border border-black rounded-lg' type='text' value={search} placeholder='Search...' onChange={(e)=>setSearch(e.target.value)} />
            <button onClick={searchByTitle}>🔎</button>
        </div>
        <div>
          <button className='border border-black rounded-lg p-2' onClick={()=>nav('/writeBlog/' + par.uuid)}>Write a blog!</button>
        </div>
      </div>
      <div className='flex justify-center items-center space-x-4'>
          <button onClick={()=>{
            if(dateOrder === 'DESC'){
              setDateOrder('ASC')
            } else {setDateOrder('DESC')}
          }}>{dateOrder === 'DESC' ? 'Newest' : 'Oldest'}</button>
      </div>
      <div className='grid grid-cols-3 lg-4 p-2 space-y-4'>
        {blogs.map((val,idx)=>(
          <Blogcard title={val.title} author={val.author} creationdate={val.createddate} likes={val.likes} previewData={val.data.slice(0,50) + '...'} blogid={val.id}/>
        ))}
      </div>
      <div className='flex justify-center items-center space-x-4'>
        <button onClick={()=>setBatchNumber(prev=>Math.max(1,prev-1))}>⬅️</button>
        <p>{batchNumber}</p>
        <button onClick={()=>setBatchNumber(prev=>prev+1)}>➡️</button>
      </div>
    </div>
    {toast.message.length > 0 && (
      <Toast message={toast.message} ok={toast.ok} />
    )}
    </div>
  )
}