import {v2} from "cloudinary"
import fs from "fs" 

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY , 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const uploadOnCloudinary = async (localFilePath) =>{
       try {
        if(!localFilePath) return null
        
        //upload the file on cloudinary
   const response = await cloudinary.uploader.upload(localFilePath,{   //public id ,voideo,png upload kr skte hai
    resource_type: "auto" 

   })  //file uploaded successfully
   console.log("file is uploaded on cloudnary" , response.url);
return response;
       } catch (error) {
        fs.uplinkSync(localFilePath) // remove the locally saved temporary file as the upload operation failed
       
return null;    } 
    }

  export {uploadOnCloudinary}  