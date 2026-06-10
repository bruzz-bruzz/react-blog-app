import express, {Request,Response} from 'express'
import {Pool} from 'pg'
import cookieparser from 'cookie-parser'
import jwt from 'jsonwebtoken'
const db = new Pool({
    host:process.env.HOST,
    port:parseInt(process.env.PORT || '5432'),
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
})
const router = express.Router()
router.use(express.json())
router.use(cookieparser())
async function verify(token:string,uuid:string){
    const decrypted = jwt.verify(token,process.env.JWT_SECRET as string) as {uuid:string}
    return decrypted.uuid === uuid
}
async function isBatchFull(batchnumber:number){
        const fetch = await db.query("SELECT * From blogdata where batchnumber = $1",[batchnumber])
        return fetch.rows.length >= 50
}
async function hasUserLiked(blogid:string,userid:string){
    const res = await db.query("SELECT * FROM blogdata where id = $1",[blogid])
    return res.rows[0].likes.includes(userid)
}
router.post('/likeBlog',async(req:Request,res:Response)=>{
    if(await verify(req.cookies.token,req.body.uuid) === false){    
        return res.status(400).json({message:"Unauthorized",ok:false})
    }
    if(await hasUserLiked(req.body.blogid,req.body.uuid) === true){
        await db.query("UPDATE blogdata set likes = array_remove(likes,$1) where id = $2",[req.body.uuid,req.body.blogid])
        return res.status(200).json({message:"Blog unliked successfully",ok:true})
    } else{
        await db.query("UPDATE blogdata set likes = array_append(likes,$1) where id = $2",[req.body.uuid,req.body.blogid])
        return res.status(200).json({message:"Blog liked successfully",ok:true})
    }
})
router.post('/getBlogs',async(req:Request,res:Response)=>{
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json({message:"Unauthorized",ok:false})
    }
    if(req.body.getAll === true){
        const results = await db.query("SELECT * FROM blogdata order by createddate $1 limit 30 where batchnumber = $2",[req.body.order,req.body.batchnumber])
        return res.status(200).json({message:"Blogs fetched successfully",ok:true,data:results.rows})
    }
    const results = await db.query("SELECT * FROM blogdata where userid = $1 AND batchnumber = $2 order by createddate $3",[req.body.uuid,req.body.batchnumber,req.body.order])
    return res.status(200).json({message:"Blogs fetched successfully",ok:true,data:results.rows})
})
router.post('/editBlog',async(req:Request,res:Response)=>{
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json({message:"Unauthorized",ok:false})
    }
    await db.query("UPDATE blogdata set title=$1 data=$2 editeddate=$3 where id = $4",[req.body.title,req.body.data,new Date(),req.body.blogid])
    return res.status(200).json({message:"Blog updated successfully",ok:true})
})
router.post('/addBlog',async(req:Request,res:Response)=>{
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json({message:"Unauthorized",ok:false})
    }
    let batchnumber = await db.query("SELECT max(batchnumber) from blogdata")
    if(await isBatchFull(batchnumber.rows[0].batchnumber) === true){
        batchnumber.rows[0].batchnumber++
    }
    await db.query("INSERT INTO blogdata(userid,title,data,createddate,comments,editeddate,username,batchnumber,likes) VALUES($1,$2,$3,$4,$5,$6,$7)",[req.body.uuid,req.body.title,req.body.data,new Date(),'{}',new Date(),req.body.username,batchnumber.rows[0].batchnumber,'[]'])
    return res.status(200).json({message:"Blog added successfully",ok:true})
})
router.delete('/deleteBlog',async(req:Request,res:Response)=>{
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json({message:"Unauthorized",ok:false})
    }
    await db.query("DELETE FROM blogdata WHERE userid = $1",[req.body.uuid])
    return res.status(200).json({message:"Blog deleted successfully",ok:true})
})
export default router