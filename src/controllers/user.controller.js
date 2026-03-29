import {asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from  "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary, uploadonCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req,res) => {

   // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


 const{fullname, email , username ,password} = req.body
 console.log("email:" ,email);
//   if(fullname === "") {
// throw new ApiError(400, "full name is required")
//   }
//   if(email ===""){
//    throw new ApiError(400,"email is required")
//   }
// if(username ===""){
// throw new ApiError(400, "username is required")
// }
// if(password === ""){
//    throw new ApiError(400,"password is required")
// }

if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

   const existedUser =  User.findOne({
      $or :[{ username },{ email }]   
         // $ symbol se or and nor etc use kr skte hain  Agar same username ya same email already exist karta hai → error throw karo
    })
    if(existedUser){
      throw new ApiError(409,"User with email or username already exists")
    }
    //middleware request field me aur element add krta hai

    //multer req.files ka access de deta hai

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath =  Rewind.files?.coverImage[0]?.path;

   if(!avatarLocalPath){
      throw new ApiError(400,"Avatar fileis required")
   }
  const avatar = await uploadonCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath )

if(!avatar){
   throw new ApiError(400,"Avatar fileis required")
}

const user = await User.create({
   fullname,
   avatar: avatar.url,
   coverImage: coverImage?.url || "",
   email,
   password,
   username: username.tolowercase()
})

const createdUser=await User.findById(user._id).select(
   "-password -refreshToken"     // -ve ka mtlb hai jo hmme nh chaiye unko -ve ke saath likhte hai
)
// Database se user ko dobara fetch karna (by ID)
// Aur password & refreshToken fields ko remove karke result dena

if(!createdUser){
   throw new ApiError (500,"Something went wrong while registering the user")
}
return res.status(201).json(
   new ApiResponse(200,createdUser,"User registerd Sucessfully")      //(status code , data ,message (optional))
)
})

export {registerUser,}