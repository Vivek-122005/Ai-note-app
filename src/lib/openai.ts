// import { uploadFile } from "./firebase";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { uploadOnCloudinary} from "./cloudinary";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY as string;
const CLIPDROP_API_KEY = process.env.CLIP_API as string;
const cloudinary = require('cloudinary').v2


const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
export async function generateImagePrompt(name: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `You are an creative and helpful AI assistance capable of generating interesting thumbnail descriptions for my notes. Your output will be fed into the GEMINI API to generate a thumbnail. The description should be minimalistic and flat styled. Please generate a thumbnail description for my notebook titles ${name}.`;
  const image_description = await model.generateContent(prompt);
  return image_description.response.text() as string;
}
export async function generateImage(imageDescription : string,name :string) {
  const form = new FormData()
  const prompt = `${imageDescription}`;
  form.append('prompt', `${prompt}`)

  try {
    const response = await fetch('https://clipdrop-api.co/text-to-image/v1', {
      method: 'POST',
      headers: {
        'x-api-key': `${CLIPDROP_API_KEY}`,
      },
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text(); 
      console.error(`Error generating image: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

   const buffer = await response.arrayBuffer();
   console.log('Image generated successfully!');
   const imageUrl = await uploadOnCloudinary(Buffer.from(buffer));
   if(!imageUrl){
    return null;
   }
   return imageUrl.url as string

  } catch (error) {
    console.error('Error generating image:', error);
    throw error; 
}
}