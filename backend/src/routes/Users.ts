import express, { Request,Response} from 'express'
import {Pool} from 'pg'
import jwt from 'jsonwebtoken'
import cookieparser from 'cookie-parser'
import bcrypt from 'bcrypt'
import {body,validationResult} from 'express-validator'
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
type returnData = {
    message:string,
    ok:boolean,
    data?:any
}
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
    const decrypted = jwt.verify(token,process.env.JWT_SECRET as string) as {uuid:string}
    return decrypted.uuid === uuid
}
router.post('/verifyUser',[
    body('uuid').isInt()
],async(req:Request,res:Response<returnData>)=>{
    const errs = validationResult(req)
    if(!errs.isEmpty()){return res.status(400).json({message:"Data input error",ok:false})}
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json({message:"Unauthorized",ok:false})
    }
    return res.status(200).json({message:"User verified successfully",ok:true})
})
router.post('/getUserData',[
    body("uuid").isInt()
],async(req:Request,res:Response<returnData>)=>{
    const errs = validationResult(req)
    if(!errs.isEmpty()){return res.status(400).json({message:"Data input error",ok:false})}
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json({message:"Unauthorized",ok:false})
    }
    const user = await db.query("SELECT email,username,registereddate FROM blogusers WHERE id = $1",[req.body.uuid])
    return res.status(200).json({message:"User data fetched successfully",ok:true,data:user.rows[0]})
})
router.post('/changeEmail',[
    body("uuid").isInt(),
    body('password').trim().escape(),
    body("email").trim().escape(),
],async(req:Request,res:Response<returnData>)=>{
    const errs = validationResult(req)
    if(!errs.isEmpty()){return res.status(400).json({message:"Data input error",ok:false})}
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json({message:"Unauthorized",ok:false})
    }
    if(await doesPasswordMatch(req.body.uuid,req.body.password) === false){
        return res.status(400).json({message:"Incorrect password",ok:false})
    }
    await db.query("UPDATE blogusers SET email = $1 WHERE id = $2",[req.body.email,req.body.uuid])
    return res.status(200).json({message:"Email changed successfully",ok:true})
})
router.post("/changePassword",[
    body('uuid').isInt(),
    body('password').trim().escape(),
    body("newPassword").trim().escape()
],async(req:Request,res:Response<returnData>)=>{
    const errs = validationResult(req)
    if(!errs.isEmpty()){return res.status(400).json({message:"Data input error",ok:false})}
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json({message:"Unauthorized",ok:false})
    }
    if(await doesPasswordMatch(req.body.uuid,req.body.password) === false){
        return res.status(400).json({message:"Incorrect password",ok:false})
    }
    const hash = await bcrypt.hash(req.body.newPassword,10)
    await db.query("UPDATE blogusers set password = $1 where id = $2",[hash,req.body.uuid])
    return res.status(200).json({message:"Password changed successfully",ok:true})
})
router.post("/changeUsername",[
    body('uuid').isInt(),
    body("password").trim().escape(),
    body("username").trim().escape()
],async(req:Request,res:Response<returnData>)=>{
    const errs = validationResult(req)
    if(!errs.isEmpty()){return res.status(400).json({message:"Data input error",ok:false})}
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json({message:"Unauthorized",ok:false})
    }
    if(await doesPasswordMatch(req.body.uuid,req.body.password) === false){
        return res.status(400).json({message:"Incorrect password",ok:false})
    }
    await db.query("update blogusers set username = $1 where id = $2",[req.body.username,req.body.uuid])
    return res.status(200).json({message:"Username changed successfully",ok:true})
})
router.post('/register',[
    body("email").trim().escape(),
    body("password").trim().escape(),
],async(req:Request,res:Response<returnData>)=>{
    const errs = validationResult(req)
    if(!errs.isEmpty()){return res.status(400).json({message:"Data input error",ok:false})}
    if(await doesEmailExist(req.body.email) === true){
        return res.status(400).json({message:"Email already exists",ok:false})
    }
    const hash = await bcrypt.hash(req.body.password,10)
    await db.query("insert into blogusers(email,password,username,registereddate) values($1,$2,$3,$4)",[req.body.email,hash,req.body.username,new Date()])
    return res.status(200).json({message:"Registered successfully",ok:true})
})
router.post('/login',[
    body('email').trim().escape(),
    body("password").trim().escape(),
],async(req:Request,res:Response<returnData>)=>{
    const errs = validationResult(req)
    if(!errs.isEmpty()){return res.status(400).json({message:"Data input error",ok:false})}
    if(await doesEmailExist(req.body.email) === true){
        return res.status(400).json({message:"Email already exists",ok:false})
    }
    const pass = await db.query("SELECT password from blogusers where email = $1",[req.body.email])
    if(await bcrypt.compare(pass.rows[0].password,req.body.password) === false){
        return res.status(400).json({message:"Password does not match",ok:false})
    }
    const maxId = await db.query("SELECT max(id) from blogusers")
    const token = jwt.sign({uuid:parseInt(maxId.rows[0].id) + 1},process.env.JWT_SECRET as string,{expiresIn:'14d'})
    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'development' ? false : true,
        sameSite:process.env.NODE_ENV === 'development' ? false : true,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
    return res.status(200).json({message:"Login successful",ok:true,data:parseInt(maxId.rows[0].id + 1)})
})
router.post('/logout',[
    body("uuid").isInt()
],async(req:Request,res:Response<returnData>)=>{
    const errs = validationResult(req)
    if(!errs.isEmpty()){return res.status(400).json({message:"Data input error",ok:false})}
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json({message:"Unauthorized",ok:false})
    }
    res.clearCookie("token")
    return res.status(200).json({message:"Successfully logged out",ok:true})
})
router.delete('/deleteAccount',[
    body("uuid").isInt(),
    body('email').trim().escape()
],async(req:Request,res:Response<returnData>)=>{
    const errs = validationResult(req)
    if(!errs.isEmpty()){return res.status(400).json({message:"Data input error",ok:false})}
    if(await verify(req.cookies.token,req.body.uuid) === false){
        return res.status(400).json({message:"Unauthorized",ok:false})
    }
    if(await doesEmailExist(req.body.email) === false){
        return res.status(400).json({message:"Email does not exist",ok:false})
    }
    res.clearCookie('token')
    await db.query("DELETE FROM blogusers WHERE email = $1",[req.body.email])
    return res.status(200).json({message:"Account successfully deleted",ok:true})
})
export default router