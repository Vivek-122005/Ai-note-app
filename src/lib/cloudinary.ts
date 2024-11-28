import {v2 as cloudinary} from "cloudinary"
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// const uploadOnCloudinary = async (localFilePath : string) =>{
//     try{
//         if(!localFilePath) return null
//         const response = await cloudinary.uploader.upload(localFilePath,{
//             resource_file: "auto"
//         })
//         return response;
//     }catch(error){
//         return null;

//     }
// }

const uploadOnCloudinary = async (bufferData: Buffer) => {
    try {
        if (!bufferData) return null;

        const response = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
                if (result) resolve(result);
                else reject(error);
            });
            // Write buffer data to the stream
            uploadStream.end(bufferData);
        });

        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
};


export{uploadOnCloudinary}