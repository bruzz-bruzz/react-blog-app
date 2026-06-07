import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import cookieparser from 'cookie-parser'
import User from './routes/Users'
import Data from './routes/Data'
require('dotenv').config()
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
})
const app = express()
app.use(helmet())
app.use(cookieparser())
app.use(cors({
    credentials:true,
    origin:process.env.ORIGIN
}))
app.use(express.json())
app.use(limiter)
app.use('/user',User)
app.use('/data',Data)
app.listen(8080)