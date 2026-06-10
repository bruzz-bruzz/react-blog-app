import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
<<<<<<< HEAD
import axios from 'axios'
import './App.css'
import Toast from './Toast'
type responseData = {
    message:string,
    ok:boolean
}
=======
import './App.css'
>>>>>>> 14e2c0703e06c27c6e884b35007dd474683448dc
export default function Login(){
    const nav = useNavigate()
    const [email,setEmail] = useState<string>("")
    const [password,setPassword] = useState<string>("")
<<<<<<< HEAD
    const [toast,setToast] = useState<{message:string,ok:boolean}>({message:"",ok:false})
    async function login(){
        try {
            const response = await axios.post<responseData>(`${import.meta.env.VITE_BACKEND_URL}/user/login`,{email:email,password:password})
            setToast({message:response.data.message,ok:response.data.ok})
        } catch(err){
            setToast({message:'Error',ok:false})
        }
=======
    async function login(){
        
>>>>>>> 14e2c0703e06c27c6e884b35007dd474683448dc
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
<<<<<<< HEAD
                    <button type='submit' className='border border-black rounded-lg p-2' onClick={()=>{
                        login()
                    }}>Login</button>
                    <p>Don't have an account? <p className='text-blue-500' onClick={()=>nav('/register')}>Sign up!</p></p>
                </form>
            </div>
            {toast.message.length > 0 && (
                <Toast message={toast.message} ok={toast.ok}/>
            )}
=======
                    <button type='submit' className='border border-black rounded-lg p-2'>Login</button>
                    <p>Don't have an account? <p className='text-blue-500' onClick={()=>nav('/register')}>Sign up!</p></p>
                </form>
            </div>
>>>>>>> 14e2c0703e06c27c6e884b35007dd474683448dc
        </div>
    )
}