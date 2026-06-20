import './App.css'
import {useState,useEffect} from 'react'
import {useParams} from 'react-router-dom'
import Toast from './Toast'
import axios from 'axios'
export default function Blog(){
    const par = useParams()
    const [blog,setBlog] = useState<any>()
    const [comment,setComment] = useState<string>("")
    const [toast,setToast] = useState<{message:string,ok:boolean}>({message:"",ok:false})
    async function getBlogData(){
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/getBlogs`,{
            blogid:par.blogid
        })
        setBlog(res.data)
    }
    useEffect(()=>{
        getBlogData()
    },[])
    return (
        <div className='font-mono'>
            <div className='flex justify-center items-center flex-col'>
                {blog !== undefined && (
                    <div className='flex justify-center items-center flex-col'>
                        <div>
                            <h1>{blog.title}</h1>
                            <h4>Written by: {blog.username}</h4>
                            <h4>Written on: {blog.createddate}</h4>
                            <h4>Last edited on: {blog.editeddate}</h4>
                        </div>
                        <div className='w-9/10 flex justify-center items-center flex-col'>   
                            {blog.data}
                        </div>
                        <div className='flex justify-center items-center flex-col w-9/10'>
                            <h3 className='border-b border-gray-300'>Comments:</h3>
                            {blog.comments.map((val:any,idx:any)=>(
                                <div key={idx}>
                                    <h3>{val.split(' ')[0]} said:</h3>
                                    <h4>{val.split(' ')[1]}</h4>
                                    <h4>{val.split(' ')[2]}</h4>
                                </div>
                            ))}
                            {blog.comments.length === 0 && (
                                <div>
                                    <p>No comments =(</p>
                                </div>
                            )}
                            <textarea onChange={(e)=>setComment(e.target.value)} rows={5} className='border border-black rounded-lg p-2 w-4/5' disabled placeholder='Write your comment here...'></textarea>
                            <button className='hover:underline' onClick={async ()=>{
                                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/addComment`,{
                                    withCredentials:true,
                                    comment:comment,
                                    blogid:par.blogid
                                })
                                if(res.data.ok){
                                    setToast({message:res.data.message,ok:res.data.ok})
                                } else{
                                    setToast({message:res.data.message,ok:res.data.ok})
                                }
                            }}>Add comment</button>
                        </div>
                        <div>   
                            <h4>Likes: {blog.likes.length}</h4>
                            <button>Like</button>
                        </div>
                    </div>
                )}
            </div>
            {toast.message.length > 0 && (
                <Toast message={toast.message} ok={toast.ok} />
            )}
        </div>
    )
}