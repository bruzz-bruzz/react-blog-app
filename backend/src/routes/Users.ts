import express, { Request,Response} from 'express'
import {Pool} from 'pg'
import jwt from 'jsonwebtoken'
import cookieparser from 'cookie-parser'
import bcrypt from 'bcrypt'
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
async function doesEmailExist(email:string){
    const query = await db.query("SELECT * FROM blogusers where email = $1",[email])
    return query.rows.length > 0
}
async function doesPasswordMatch(id:string,password:string){
    const query = await db.query("SELECT * From blogusers where id = $1",[id])
    if(query.rows.length === 0){
        return false
    }
    return await bcrypt.compare(query.rows[0].password,password)
}
async function verify(token:string,uuid:string){
    const decrypted = jwt.decode(token)
    return decrypted === uuid
}
router.post('/changeEmail',async(req:Request,res:Response)=>{
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json({message:"Unauthorized"})
    }
    if(await doesEmailExist(req.body.email) === false){
        return res.status(400).json({message:"Email does not exist"})
    }
    if(await doesPasswordMatch(req.body.uuid,req.body.password) === false){
        return res.status(400).json({message:"Incorrect password"})
    }
    await db.query("UPDATE blogusers SET email = $1 WHERE id = $2",[req.body.email,req.body.uuid])
    return res.status(200).json({message:"Email changed successfully"})
})
router.post("/changePassword",async(req:Request,res:Response)=>{
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json({message:"Unauthorized"})
    }
    if(await doesEmailExist(req.body.email) === false){
        return res.status(400).json({message:"Email does not exist"})
    }
    if(await doesPasswordMatch(req.body.uuid,req.body.password) === false){
        return res.status(400).json({message:"Incorrect password"})
    }
    const hash = await bcrypt.hash(req.body.newPassword,10)
    await db.query("UPDATE blogusers set password = $1 where id = $2",[hash,req.body.uuid])
    return res.status(200).json({message:"Password changed successfully"})
})
router.post("/changeUsername",async(req:Request,res:Response)=>{
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json({message:"Unauthorized"})
    }
    if(await doesEmailExist(req.body.email) === false){
        return res.status(400).json({message:"Email does not exist"})
    }
    if(await doesPasswordMatch(req.body.uuid,req.body.password) === false){
        return res.status(400).json({message:"Incorrect password"})
    }
    await db.query("update blogusers set username = $1 where id = $2",[req.body.username,req.body.uuid])
    return res.status(200).json({message:"Username changed successfully"})
})
router.post('/register',async(req:Request,res:Response)=>{
    if(await doesEmailExist(req.body.email) === true){
        return res.status(400).json({message:"Email already exists"})
    }
    const hash = await bcrypt.hash(req.body.password,10)
    await db.query("insert into blogusers(email,password,username,registereddate) values($1,$2,$3,$4)",[req.body.email,hash,req.body.username,new Date()])
    return res.status(200).json({message:"Registered successfully"})
})
router.post('/login',async(req:Request,res:Response)=>{
    if(await doesEmailExist(req.body.email) === true){
        return res.status(400).json({message:"Email already exists"})
    }
    if(await doesPasswordMatch(req.body.email,req.body.password) === false){
        return res.status(400).json({message:"Password does not match"})
    }
    const maxId = await db.query("SELECT max(id) from blogusers")
    const token = jwt.sign({uuid:parseInt(maxId.rows[0].id) + 1},process.env.JWT_SECRET as string,{expiresIn:'14d'})
    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'development' ? false : true,
        sameSite:process.env.NODE_ENV === 'development' ? false : true,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
    return res.status(200).json({message:"Login successful"})
})
router.post('/logout',async(req:Request,res:Response)=>{
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json({message:"Unauthorized"})
    }
    res.clearCookie("token")
    return res.status(200).json({message:"Successfully logged out"})
})
router.delete('/deleteAccount',async(req:Request,res:Response)=>{
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json({message:"Unauthorized"})
    }
    if(await doesEmailExist(req.body.email) === false){
        return res.status(400).json({message:"Email does not exist"})
    }
    await db.query("DELETE FROM blogusers WHERE email = $1",[req.body.email])
    return res.status(200).json({message:"Account successfully deleted"})
})
export default router