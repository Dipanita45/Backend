import express from "express";
import cors from "cors";
import cookieParser
 from "cookie-parser";   //server hi use kr skta hai sirf


const app = express();

     app.use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials : true
     }))     

app.use(express.json({limit: "16kb"}))

app.use(express.urlencoded({extended:true , limit : "16kb"}))
app.use(express.static ("public"))  //public assests
app.use(cookieParser())     //only server can access
//this is not access by other only information access by server

export { app }




// THEIR IS FOUR ELEMENT :- {err, req, res ,next}