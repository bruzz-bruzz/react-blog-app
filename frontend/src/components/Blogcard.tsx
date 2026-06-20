import './App.css'
type Data = {
    title:string,
    author:number,
    creationdate:string,
    likes:number,
    previewData:string,
    blogid:number,
    editingperms:boolean
}
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {useState,useEffect} from 'react'
export default function Blogcard({title,author,creationdate,likes,previewData,blogid,editingperms}:Data){
    const nav = useNavigate()
    const [username,setUsername] = useState<string>("")
    async function deleteBlog(){
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/deleteBlogs`,{
            withCredentials:true,
            blogid:blogid
        })
    }
    async function getUsername(){
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/getUserData`,{
            withCredentials:true,
            id:author
        })
        setUsername(res.data.username)
    }
    useEffect(()=>{
        getUsername()
    },[])
    return (
        <div className='font-mono'>
            {editingperms === true && (
                <div className='absolute top-5 right-5'>   
                    <button className='hover:underline' onClick={()=>deleteBlog()}>Delete</button>
                    <button className='hover:underline' onClick={()=>nav(`/editblog/${author}/${blogid}`)}>Edit</button>
                </div>
            )}
            <div className='w-3/4 font-mono flex justify-center items-center flex-col p-2 rounded-lg'>
                <h1>{title}</h1>
                <h3>By: {username+String(author)}</h3>
                <h2>Posted on: {creationdate}</h2>
                <p>{previewData}</p>
                <h3>Likes: {likes}</h3>
                <button onClick={()=>nav(`/blogid/${blogid}`)}>See more</button>
            </div>
        </div>
    )
}