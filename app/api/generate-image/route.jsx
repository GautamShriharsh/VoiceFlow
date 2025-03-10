import axios from 'axios';
import { NextResponse } from 'next/server';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '@/configs/firebaseConfig';

// Utility function to convert image URL to base64
async function convertImageToBase64(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(response.data).toString('base64');
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error('Error converting image to base64:', error.message);
    throw new Error('Failed to convert image to base64');
  }
}

// Utility function to upload to Firebase and get URL
async function uploadToFirebase(base64Image, fileName) {
  try {
    const storageRef = ref(storage, fileName);
    await uploadString(storageRef, base64Image, 'data_url');
    const firebaseUrl = await getDownloadURL(storageRef);
    return firebaseUrl;
  } catch (error) {
    console.error('Error uploading to Firebase:', error.message);
    throw new Error('Failed to upload image to Firebase');
  }
}


export async function POST(req) {
  try {
    // Validate request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    const { imagePrompt } = body;
    if (!imagePrompt) {
      return NextResponse.json({ error: 'imagePrompt is required' }, { status: 400 });
    }

    const BASE_URL = 'https://aigurulab.tech';

    // Validate API key
    if (!process.env.GENERATE_IMAGE_API) {
      return NextResponse.json({ error: 'AIGuruLab API key is not configured' }, { status: 500 });
    }

    console.log('Received imagePrompt:', imagePrompt); // Debug log
    console.log('AIGuruLab API Key:', process.env.GENERATE_IMAGE_API ? 'Set' : 'Not Set'); // Debug log

    const result = await axios.post(
      `${BASE_URL}/api/generate-image`,
      {
        width: 1024,
        height: 1024,
        input: imagePrompt,
        model: 'sdxl',
      },
      {
        headers: {
          'x-api-key': process.env.GENERATE_IMAGE_API,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('AIGuruLab full response:', result.data); // Debug log
    if (!result.data.image) {
      return NextResponse.json({ error: 'No image data in AIGuruLab response' }, { status: 500 });
    }

    console.log('Generated image URL:', result.data.image); // Debug log
    

    //Save to Firebase
    const base64Image = await convertImageToBase64(result.data.image);
    const fileName = `voiceFlow_${Date.now()}.png`;    
    const firebaseUrl = await uploadToFirebase(base64Image, fileName);

    return NextResponse.json({ image: firebaseUrl }); // Return the firebase download URL directly




  } catch (error) {
    console.error('Error in POST request:', error.message, 'Stack:', error.stack);
    if (error.response) {
      console.error('AIGuruLab response:', error.response.data);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const ConvertImage = async (imageUrl) => {
  try {
    const res = await axios.get(imageUrl, { responseType: 'arrayBuffer' });

    const base64Image = Buffer.from(res.data).toString('base64');

    return base64Image;
  } catch (error) {
    console.log('Error converting image to base64', error);

  }
}