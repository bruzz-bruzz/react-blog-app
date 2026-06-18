import './App.css'
type Data = {
    title:string,
    author:string,
    creationdate:string,
    likes:number,
    alreadyLiked:boolean,
    previewData:string,
    userid:number,
    blogid:number
}
import axios from 'axios'
export default function Blogcard({title,author,creationdate,likes,alreadyLiked,previewData,userid,blogid}:Data){
    async function updateLike(){
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/data/updateLike`,{
            uuid:userid,
            blogId:blogid
        })
    }
    return (
        <div>
            <div className='w-3/4 font-mono flex justify-center items-center flex-col p-2 rounded-lg'>
                <h1>{title}</h1>
                <h3>By: {author}</h3>
                <h2>Posted on: {creationdate}</h2>
                <p>{previewData}</p>
                <h3>Likes: {likes} <button>{alreadyLiked ? 'Liked' : "Like"}</button></h3>
            </div>
        </div>
    )
}