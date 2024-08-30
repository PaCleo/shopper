import { Content, GenerateContentRequest, GoogleGenerativeAI } from "@google/generative-ai";
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

const processImageWithGemini = async (base64Image:String) => {
    const apiKey = process.env.GEMINI_API_KEY;  
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
        
    const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2800,
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig });
    const cleanedBase64Image = base64Image.replace(/^data:image\/jpeg;base64,/, '');
        
    async function generateContent() {
        const content: Content = {
            role: 'user',
            parts: [
              {
                text: 'I need the number of the digital display',
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: cleanedBase64Image,
                },
              },
            ],
          };
        
        const request: GenerateContentRequest = {
            contents: [content],
        };
        const data = await model.generateContent(request)
        const result = await data.response;
        const text=result.text()
        const value = extractNumbers(text);
        return value;
    }

    const extractNumbers = (text:string): number => {
        const numbers = text.match(/\d+/g);
        return numbers ? parseInt(numbers.join(''), 10) : 0;
    }

    const value = await generateContent();
    const image_url = await uploadImageToStorage(cleanedBase64Image);
    const uuid = uuidv4();
    return {value, image_url, uuid};

}

const uploadImageToStorage = async (base64Image: string) => {
  const storage = new Storage({
    projectId:process.env.PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
  });

  if (!process.env.BUCKET_NAME){
    throw new Error('BUCKET_NAME is not defined');
  }

  const bucket = storage.bucket(process.env.BUCKET_NAME);

  const buffer = Buffer.from(base64Image, 'base64');

  const fileName = `images/${Date.now()}.jpg`;

  await bucket.file(fileName).save(buffer,{
    metadata: {
      contentType: 'image/jpeg',
    },
    public: true
  });

  const [url] = await bucket.file(fileName).getSignedUrl({
    action: 'read',
    expires: '09-09-2024',
  })

  return url;
};

export default processImageWithGemini
