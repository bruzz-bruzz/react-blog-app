import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './App.css'
export default function Login(){
    const nav = useNavigate()
    const [email,setEmail] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    async function login(){
        
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
                    <button type='submit' className='border border-black rounded-lg p-2'>Login</button>
                    <p>Don't have an account? <p className='text-blue-500' onClick={()=>nav('/register')}>Sign up!</p></p>
                </form>
            </div>
        </div>
    )
}