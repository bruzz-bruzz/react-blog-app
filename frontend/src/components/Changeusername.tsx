import './App.css'
import {useState} from 'react'
import Toast from './Toast'
import axios from 'axios'
import {useParams,useNavigate} from 'react-router-dom'
export default function Changeusername(){
    const [toast,setToast] = useState<{message:string,ok:boolean}>({message:"",ok:false})
    const [currPassword,setCurrPassword] = useState<string>("")
    const [username,setUsername] = useState<string>("")
    const par = useParams()
    const nav = useNavigate()
    async function changeUsername(){
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/changeUsername`,{
            withCredentials:true,
            uuid:par.uuid,
            password:currPassword,
            username:username
        })
        if(res.data.ok){
            setToast({message:"Username changed successfully",ok:true})
            setTimeout(()=>{
                nav('/login')
            },3000)
        }else{
            setToast({message:"Failed to change username",ok:false})
            setTimeout(()=>{
                setToast({message:"",ok:false})
            },3000)
        }
    }
    return (
        <div className='flex justify-center items-center font-mono text-slate-500'>
            <div className='flex justify-center items-center flex-col'>
                <form>
                    <div>
                    <label htmlFor='currPassword'>Current password</label>
                    <input type='password' id='currPassword' value={currPassword} onChange={(e)=>setCurrPassword(e.target.value)} className='border border-black rounded-lg p-2' />
                    </div>
                    <div>
                            <label htmlFor='username'>New Username</label>
                            <input type='text' id='username' value={username} onChange={(e)=>setUsername(e.target.value)} className='border border-black rounded-lg p-2' />
                    </div>
                    <button type='submit' className='border border-black rounded-lg p-2' onClick={()=>changeUsername()}>Change Username</button>
                </form>
            </div>
            {toast.message.length > 0 && (
                <Toast message={toast.message} ok={toast.ok}/>
            )}
        </div>
    )
}