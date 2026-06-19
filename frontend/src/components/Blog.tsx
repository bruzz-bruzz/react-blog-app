import './App.css'
import {useState,useEffect} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
export default function Blog(){
    const par = useParams()
    const [blog,setBlog] = useState<any>()
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

                        </div>
                        <div>   
                            <h4>Likes: {blog.likes.length}</h4>
                            <button>Like</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}