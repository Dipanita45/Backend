import mongoose, {Schema} from "mongoose";


const subsciption = new Schema({
subscriber : {
    type: mongoose.Schema.Types.ObjectId, //one who is subscribing
    ref: "User"
},

channel:{
    type: mongoose.Schema.Types.ObjectId,  // one to whom 'subscriber'is subscribing
    ref: "User"
}

},{timestamps :true})


export const Subsciption = mongoose.model("Subsciption,subsciptionSchema")  