import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './App.css'
import axios from 'axios'
import Toast from './Toast'
type responseData = {
    message:string,
    ok:boolean
}
export default function Register(){
    const nav = useNavigate()
    const [email,setEmail] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [toast,setToast] = useState<{message:string,ok:boolean}>({message:"",ok:false})
    async function register(){
        try{
            const response = await axios.post<responseData>(`${import.meta.env.VITE_BACKEND_URL}/user/register`,{
                email:email,password:password
            })
            setToast({message:response.data.message,ok:response.data.ok})
        } catch(err){
            setToast({message:'Error',ok:false})
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-white font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-semibold text-gray-800">Create account</h1>
                    <p className="text-sm text-gray-500">Register a new account</p>
                </div>
                <form className="space-y-4" onSubmit={(e)=>{e.preventDefault(); register()}}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="text"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg shadow">Create account</button>
                    <div className="text-center text-sm text-gray-600">
                        Already have an account? <button className="text-rose-600 hover:underline" onClick={(e)=>{e.preventDefault(); nav('/login')}}>Login now</button>
                    </div>
                </form>
            </div>
            {toast.message.length > 0 && (
                <Toast message={toast.message} ok={toast.ok}/>
            )}
        </div>
    )
}