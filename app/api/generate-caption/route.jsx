import { AssemblyAI } from 'assemblyai'
import { NextResponse } from 'next/server';


export async function POST(req) {
    try {
        const { audioFileUrl } = await req.json();

        // Validate input
        if (!audioFileUrl) {
            return NextResponse.json({ error: 'audioFileUrl is required' }, { status: 400 });
        }

        const client = new AssemblyAI({
            apiKey: process.env.CAPTION_API,
        });

        const audioUrl = audioFileUrl;

        const config = {
            audio_url: audioUrl
        }

        const transcript = await client.transcripts.transcribe(config)
        console.log('Transcript words:', transcript.words);

        if (!transcript.words || !Array.isArray(transcript.words)) {
            throw new Error('Transcription failed or no words returned');
        }

        return NextResponse.json({ 'result': transcript.words })


    } catch (error) {
        console.error('Error in transcription:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}