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
    const decrypted = jwt.decode(token)
    return decrypted === uuid
}
router.post('/addBlog',async(req:Request,res:Response)=>{
    
})
export default router