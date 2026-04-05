import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { raw } from "express";
// Token generator
const generateAccessandRefreshToken = async(userId)=>{
    try {

        console.log("ACCESS:", process.env.ACCESS_TOKEN_SECRET);
        console.log("REFRESH:", process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        if (!accessToken || !refreshToken) {
            throw new ApiError(500, "Token generation failed");
        }

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave : false });

        return { accessToken, refreshToken };

    } catch (error) {
        console.log("TOKEN ERROR:", error);
        throw new ApiError(500, error.message);
    }
};

// REGISTER
const registerUser = asyncHandler(async (req, res) => {

    const { fullName, email, username, password } = req.body;

    if (
        [fullName, email, username, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    const existedUser = await User.findOne({
        $or: [
            { username: normalizedUsername },
            { email: normalizedEmail }
        ]
    });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    let coverImage;
    if (coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    // create user 
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email: normalizedEmail,          
        password,
        username: normalizedUsername 
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "User creation failed");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});

//login

const loginUser = asyncHandler(async (req, res) => {

  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  // normalize
  const normalizedUsername = username?.trim().toLowerCase();
  const normalizedEmail = email?.trim().toLowerCase();

  // find user
  const user = await User.findOne({
    $or: [
      normalizedUsername ? { username: normalizedUsername } : null,
      normalizedEmail ? { email: normalizedEmail } : null,
    ].filter(Boolean)
  });

 console.log("BODY:", req.body);

if (!user) {
  console.log(" USER NOT FOUND");
  throw new ApiError(401, "Invalid user credentials");
}

console.log("USER FOUND:", user.email);

const isPasswordValid = await user.isPasswordCorrect(password);

console.log("PASSWORD MATCH:", isPasswordValid);

if (!isPasswordValid) {
  console.log(" PASSWORD WRONG");
  throw new ApiError(401, "Invalid user credentials");
}

  // tokens
  const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken
        },
        "User logged In Successfully"
      )
    );
});
// LOGOUT
const logoutUser = asyncHandler(async(req,res) =>{
   await User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
            refreshToken: undefined
        }
    },
    {
        new: true
    }
   )

   const options = {
    httpOnly: true,
    secure: true
   }
     
   return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200,{}, "User logged Out"))
}) 

const refreshAccessToken = asyncHandler(async(req,res)=>{
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if(incomingRefreshToken){
    throw new ApiError(401,"unauthorized request")
}

try {
    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
    
    //user information  from mongodb
    
    const user = await User.findById(decodedToken?._id)
    if(!user){
        throw new ApiError(400,"Invalid refresh Token")
    }
    
    if(!incomingRefreshToken!= user?.refreshToken){
        throw new ApiError(401,"Refresh Token Is expired or used ")
    }
    
    
    const options = {
        httpOnly: true,
        secure : true
    }
    const {accessToken,newRefreshToken} = await generateAccessandRefreshToken(user._id)
    return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refteshToken", newRefreshToken,options)
    .json(
        new ApiResponse(
            200,
            {accessToken,refreshToken : newRefreshToken},
            "Acess Token Refreshed Successfully"
        )
    )
} catch (error) {
    throw new ApiError(401,error?.message ||
        "invalid Refresh token")

}
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{

    const {oldPassword, newPssword} = req.body

    //const {oldPassword, newPssword,confirmPassword}= req.body
    // if(!(newPassword == confirmPassword)){
    //throw new ApiError(404, "wrong password")}
    //req.user?.id isse mujhe user mil gya

const user = await User.findById(req.user?._id)
 const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect) {
    throw new ApiError(400 , "Invalid old password")
  }
user.password = newPassword
await user.save ({validateBeforeSave :false})

return res
.status(200)
.json(new ApiResponse(200,{},"Password changesd successfully"))
 
})

const getCurrentUser = asyncHandler(async(req,res) =>{
    return res
    .status(200)
    .json(200,"current user fetched successfully")
})

const updateAccountDetails = asyncHandler(async ( req,res) =>{

    const{ fullName,email} = req.body
// file update ko alag rakhte hain at production level conjation km hota hai

    if(!fullName || !email){
    throw new ApiError(400,"all fields are required")
}

 const user = await User.findByIdAndUpdate(
    req.user?._id,
   {
    $set : {
        fullName :fullName,   //fullName aise bhi likh skte hain
        email : email,

    }

   },
   {
    new: true
   }
).select("-password")  //

return res
.status(200)
.json(new ApiResponse(200,user,"Account details updated successfully"))
})

const updateUserAvatar= asyncHandler(async(req,res)=>{

    //req.files  -> multer se mila
  const avatarLocalPath = req.file?.path

  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is missing")
  }

  const avatar =await uploadOnCloudinary(avatarLocalPath)

  if(!avatar.url){
     throw new ApiError(400,"Error while uploading on avatar in cloudinary"
 )}


 // object update krna hai
 const user = await User.findByIdAndUpdate(
  req.user?._id,

  {
       $set:{
        avatar :avatar.url
       }

  },

  {new :true}

  ).select("-password")
})
return res
.statuS(200)
.json(new ApiResponse(
    200,user,"Avatar uploaded successfully"
))

const updateUserCoverImage= asyncHandler(async(req,res)=>{

    //req.files  -> multer se mila
  const coverImageLocalPath = req.file?.path

  if(!coverImageLocalPath){
    throw new ApiError(400,"Cover image file is missing")
  }

  const coverImage =await uploadOnCloudinary(coverImageLocalPath)

  if(!coverImage.url){
     throw new ApiError(400,"Error while uploading on coverImage in cloudinary"
 )}


 // object update krna hai
 const user = await User.findByIdAndUpdate(
  req.user?._id,
  {
       $set:{
        coverImage : coverImage.url
       }
  },
  {new :true}
  ).select("-password")
})

return res
.status(200)
.json
(new ApiResponse
    (200,user,"cover Image uploaded successfully")
)

export { registerUser,
     loginUser,
      logoutUser,
      refreshAccessToken ,
      changeCurrentPassword,
      getCurrentUser,
      updateAccountDetails ,
      updateUserAvatar,
      updateUserCoverImage
    }