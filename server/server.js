import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDb from "./config/mongodb.js";
import authRouter from './Routes/authRoutes.js'
import userRouter from "./Routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;
connectDb();

const allowedOrigins = ['http://localhost:5173']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true}))

//API ENDPOINTS
app.get('/users',(req,res)=>{
         res.json("Hey Buddy")
})

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)

app.listen(PORT,()=>{
     console.log(`Server is running on http://localhost:${PORT}`);
     
})