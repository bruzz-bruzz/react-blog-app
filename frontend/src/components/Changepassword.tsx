import './App.css'
import {useState} from 'react'
import Toast from './Toast'
import axios from 'axios'
import {useParams,useNavigate} from 'react-router-dom'
export default function Changepassword(){
    const [toast,setToast] = useState<{message:string,ok:boolean}>({message:"",ok:false})
    const [currPassword,setCurrPassword] = useState<string>("")
    const [newPassword,setNewPassword] = useState<string>("")
    const par = useParams()
    const nav = useNavigate()
    async function changePassword(){
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/changePassword`,{
            withCredentials:true,
            uuid:par.uuid,
            password:currPassword,
            newPassword:newPassword
        })
        if(res.data.ok){
            setToast({message:"Password changed successfully",ok:true})
            setTimeout(()=>{
                nav('/login')
            },3000)
        }else{
            setToast({message:"Failed to change password",ok:false})
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
                        <label htmlFor='newPassword'>New password</label>
                        <input type='password' id='newPassword' value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className='border border-black rounded-lg p-2' />
                    </div>
                    <button type='submit' className='border border-black rounded-lg p-2' onClick={()=>changePassword()}>Change Password</button>
                </form>
            </div>
            {toast.message.length > 0 && (
                <Toast message={toast.message} ok={toast.ok}/>
            )}
        </div>
    )
}