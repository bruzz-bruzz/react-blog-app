import './App.css'
type Data = {
    title:string,
    author:string,
    creationdate:string,
    likes:number,
    alreadyLiked:boolean,
    previewData:string,
}
export default function Blogcard({title,author,creationdate,likes,alreadyLiked,previewData}:Data){
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