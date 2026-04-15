import express from "express";
import cors from "cors";
import cookieParser
 from "cookie-parser";   //server hi use kr skta hai sirf
 const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


     app.use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials : true
     }))     

app.use(express.json({limit: "16kb"}))

app.use(express.urlencoded({extended:true , limit : "16kb"}))
app.use(express.static ("public"))  //public assests
app.use(cookieParser())     //only server can access (res,req)
//this is not access by other only information access by server

//routes import 

import userRouter from './routes/user.routes.js'
import healthcheckerRouter from './routes/healthcheck.routes.js'


//routes declaration
app.use("/api/v1/users", userRouter)    //app.use("/users", kisko active krna hai)



//http://localhost:8000/api/v1/users/register

export { app }

// THEIR IS FOUR ELEMENT :- {err, req, res ,next}