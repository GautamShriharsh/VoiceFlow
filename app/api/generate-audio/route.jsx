import textToSpeech   from "@google-cloud/text-to-speech"; // Named import
import { NextResponse } from "next/server";
import fs from 'fs';
import { promisify } from 'util'; // Direct import of promisify
import { storage } from "@/configs/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const client = new textToSpeech.TextToSpeechClient({
    apiKey : process.env.GOOGLE_API_KEY
});

export async function POST(req) {
  try {
    const { text, id } = await req.json();

    // Validate input
    if (!text || !id) {
      return NextResponse.json({ error: 'Text and ID are required' }, { status: 400 });
    }

    const storageRef = ref(storage, `voiceFlow/${id}.mp3`);

    const request = {
      input: { text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);

    if (!response?.audioContent) {
      throw new Error('No audio content returned from Text-to-Speech API');
    }

    const audioBuffer = Buffer.from(response.audioContent, 'binary');

    // Upload to Firebase Storage
    await uploadBytes(storageRef, audioBuffer, { contentType: 'audio/mp3' });

    // Get download URL
    const downloadUrl = await getDownloadURL(storageRef);
    console.log('Audio file uploaded, URL:', downloadUrl);

    return NextResponse.json({ Result: 'Success', downloadUrl });
  } catch (error) {
    console.error('Error in POST request:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}