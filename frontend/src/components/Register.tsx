import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './App.css'
import axios from 'axios'
import Toast from './Toast'
type responseData = {
    message:string,
    ok:boolean
}
export default function Login(){
    const nav = useNavigate()
    const [email,setEmail] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [toast,setToast] = useState<{message:string,ok:boolean}>({message:"",ok:false})
    async function login(){
        try{
            const response = await axios.post<responseData>(`${import.meta.env}/user/register`,{
                email:email,password:password
            })
            setToast({message:response.data.message,ok:response.data.ok})
        } catch(err){
            setToast({message:'Error',ok:false})
        }
    }
    return (
        <div className='flex justify-center items-center font-mono text-slate-500'>
            <div className='flex justify-center items-center flex-col'>
                <h1>Login</h1>
                <form>
                    <div>
                        <label htmlFor='email'>Email: </label>
                        <input type='text' id='email' className='border border-black rounded-lg p-2' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    </div>
                    <div>
                        <label htmlFor='password'>Password: </label>
                        <input type='password' id="password" className='border border-black rounded-lg p-2' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    </div>
                    <button type='submit' className='border border-black rounded-lg p-2' onClick={()=>{
                        login()
                    }}>Login</button>
                    <p>Don't have an account? <p className='text-blue-500' onClick={()=>nav('/register')}>Sign up!</p></p>
                </form>
            </div>
            {toast.message.length > 0 && (
                <Toast message={toast.message} ok={toast.ok}/>
            )}
        </div>
    )
}