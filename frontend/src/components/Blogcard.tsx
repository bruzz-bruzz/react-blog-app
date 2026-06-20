import './App.css'
type Data = {
    title:string,
    author:string,
    creationdate:string,
    likes:number,
    previewData:string,
    blogid:number
}
import {useNavigate} from 'react-router-dom'
export default function Blogcard({title,author,creationdate,likes,previewData,blogid}:Data){
    const nav = useNavigate()
    return (
        <div>
            <div className='w-3/4 font-mono flex justify-center items-center flex-col p-2 rounded-lg'>
                <h1>{title}</h1>
                <h3>By: {author}</h3>
                <h2>Posted on: {creationdate}</h2>
                <p>{previewData}</p>
                <h3>Likes: {likes}</h3>
                <button onClick={()=>nav(`/blogid/${blogid}`)}>See more</button>
            </div>
        </div>
    )
}