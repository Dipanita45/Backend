import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);   


    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB
//${} → insert variables inside string

//With backticks, you can directly insert variables using ${}:

// Ye sabse important part hai

// connectionInstance → jo tumne mongoose se connection banaya
// .connection → connection object
// .host → kis server/host se connect hua (like: cluster0.mongodb.net)