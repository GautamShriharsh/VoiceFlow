'use client';

import React, { useState } from 'react';
import SelectTopic from './_components/SelectTopic';
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import axios from 'axios';
import CustomLoading from './_components/CustomLoading';
import { v4 as uuidv4 } from 'uuid';
import { useVideoData } from '@/app/_context/VideoDataContext';
import { useUser } from '@clerk/nextjs';
import { db } from '../../../configs/db';
import { VideoData } from '../../../configs/schema';
import PlayerDialogue from '../_components/PlayerDialogue';
import { useRouter } from 'next/navigation';

function CreateNew() {
  const { videoData, setVideoData } = useVideoData();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    topic: '',
    style: '',
    duration: '',
  });
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState();
  const [loadingCount, setLoadingCount] = useState(0);
  const [error, setError] = useState(null);
  const loading = loadingCount > 0;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveVideoDataToDatabase = async (dataToSave) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    if (
      !dataToSave.videoScript?.length ||
      !dataToSave.audioFileUrl ||
      !dataToSave.captions?.length ||
      !dataToSave.imageList?.length
    ) {
      setError('Incomplete video data. Please ensure all steps complete successfully.');
      console.log('Data passed to save:', dataToSave);
      console.log('Current videoData state:', videoData);
      return;
    }

    const videoDataToSave = {
      script: dataToSave.videoScript,
      audioFileUrl: dataToSave.audioFileUrl,
      captions: dataToSave.captions,
      imageList: dataToSave.imageList,
      createdBy: user.primaryEmailAddress?.emailAddress || 'unknown',
    };

    console.log('Saving to DB with API data:', videoDataToSave);

    try {
      const [insertedData] = await db
        .insert(VideoData)
        .values(videoDataToSave)
        .returning({ id: VideoData.id });

      console.log('VideoData saved to database with ID:', insertedData.id);
      setVideoId(insertedData.id);
      setPlayVideo(true);
    } catch (err) {
      console.error('Error saving VideoData to database:', err);
      setError('Failed to save video data to database');
    }
  };

  const GetVideoScript = async () => {
    setLoadingCount((prev) => prev + 1);
    const prompt = `Write a script for a ${formData.duration}-second video on topic: ${formData.topic} along with AI image prompts in ${formData.style} format for each scene and a single cohesive voiceover script narrating the entire story. Return the result in JSON format with imagePrompt, contentText, and voiceover as fields, no plain text.`;

    try {
      const response = await axios.post('/api/get-video-script', { prompt });
      const scriptData = response.data.result;
      if (Array.isArray(scriptData)) {
        console.log('Video script generated:', scriptData);
        return scriptData;
      } else {
        console.error('Invalid response format: expected an array', scriptData);
        throw new Error('Invalid script data format');
      }
    } catch (error) {
      console.error('Error in GetVideoScript:', error.message);
      setError('Failed to generate video script');
      throw error;
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  };

  const GenerateAudioFile = async (videoScript) => {
    setLoadingCount((prev) => prev + 1);
    if (!Array.isArray(videoScript)) {
      console.error('videoScript is not an array:', videoScript);
      setLoadingCount((prev) => prev - 1);
      return null;
    }

    let voiceoverScript = '';
    const id = uuidv4();
    videoScript.forEach((item) => {
      if (item && item.voiceover) {
        voiceoverScript += item.voiceover + ' ';
      }
    });
    console.log('Voiceover script:', voiceoverScript.trim());

    try {
      const response = await axios.post('/api/generate-audio', { text: voiceoverScript.trim(), id });
      const audioUrl = response.data.downloadUrl;
      if (audioUrl) {
        console.log('Audio file URL generated:', audioUrl);
        return audioUrl;
      } else {
        console.error('No valid URL in response:', response.data);
        throw new Error('No audio URL returned');
      }
    } catch (error) {
      console.error('Error generating audio file:', error.message, error.response?.data);
      setError('Failed to generate audio file');
      throw error;
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  };

  const GenerateAudioCaption = async (fileUrl) => {
    setLoadingCount((prev) => prev + 1);
    if (!fileUrl) {
      console.error('No audio file URL provided');
      setLoadingCount((prev) => prev - 1);
      return null;
    }

    try {
      const response = await axios.post('/api/generate-caption', { audioFileUrl: fileUrl });
      console.log('Captions generated:', response.data.result);
      return response.data.result;
    } catch (error) {
      console.error('Error generating caption:', error.message);
      setError('Failed to generate captions');
      throw error;
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  };

  const GenerateImage = async (scriptData) => {
    setLoadingCount((prev) => prev + 1);
    if (!Array.isArray(scriptData)) {
      console.error('scriptData is not an array:', scriptData);
      setLoadingCount((prev) => prev - 1);
      return null;
    }
    try {
      const imagePromises = scriptData.map(async (element) => {
        const response = await axios.post('/api/generate-image', { imagePrompt: element.imagePrompt });
        return response.data.image;
      });
      const generatedImages = await Promise.all(imagePromises);
      console.log('Images generated:', generatedImages);
      return generatedImages;
    } catch (error) {
      console.error('Error generating images:', error.message);
      setError('Failed to generate images');
      throw error;
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  };

  const onCreateVideoHandler = async () => {
    if (!formData.topic || !formData.style || !formData.duration) {
      alert('Please fill all fields (Topic, Style, Duration)!');
      return;
    }

    setError(null);
    setLoadingCount((prev) => prev + 1);
    try {
      // Build data locally
      const videoDataToSave = {
        videoScript: [],
        audioFileUrl: '',
        captions: [],
        imageList: [],
      };

      // Step 1: Get video script
      const scriptData = await GetVideoScript();
      if (!scriptData || !scriptData.length) {
        throw new Error('No script data generated');
      }
      videoDataToSave.videoScript = scriptData;

      // Step 2: Generate audio file
      const audioUrl = await GenerateAudioFile(scriptData);
      if (!audioUrl) {
        throw new Error('Audio generation failed');
      }
      videoDataToSave.audioFileUrl = audioUrl;

      // Step 3: Generate captions
      const captions = await GenerateAudioCaption(audioUrl);
      if (!captions || !captions.length) {
        throw new Error('Caption generation failed');
      }
      videoDataToSave.captions = captions;

      // Step 4: Generate images
      const imageList = await GenerateImage(scriptData);
      if (!imageList || !imageList.length) {
        throw new Error('Image generation failed');
      }
      videoDataToSave.imageList = imageList;

      // Step 5: Update context and save
      setVideoData(videoDataToSave);
      await saveVideoDataToDatabase(videoDataToSave);
    } catch (err) {
      console.error('Error in video creation process:', err);
      if (!error) setError(err.message || 'An error occurred during video creation');
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  };

  return (
    <div className='md:px-20'>
      <h2 className='font-bold text-4xl text-primary text-center mt-6'>Create new</h2>
      {error && (
        <div className='mt-4 text-red-500 text-center'>
          {error}
        </div>
      )}
      <div className='mt-8'>
        <SelectTopic onTopicChange={(value) => handleChange('topic', value)} />
      </div>
      <div className='mt-8'>
        <SelectStyle onStyleChange={(value) => handleChange('style', value)} />
      </div>
      <div className='mt-8'>
        <SelectDuration onDurationChange={(value) => handleChange('duration', value)} />
      </div>
      <div className='mt-6 mb-3 text-center'>
        <button
          className='bg-purple-500 text-white px-8 py-2 rounded-md hover:bg-purple-600 transition-colors w-full'
          onClick={onCreateVideoHandler}
          disabled={!formData.topic || !formData.style || !formData.duration || loading}
        >
          {loading ? 'Creating...' : 'Create Short Video'}
        </button>
      </div>
      {videoData.imageList?.length > 0 && (
        <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-4'>
          {videoData.imageList.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Generated Image ${index + 1}`}
              className='w-full h-auto rounded-lg shadow-md'
            />
          ))}
        </div>
      )}
      <CustomLoading loading={loading} />
      <PlayerDialogue playVideo={playVideo} videoId={videoId} />
    </div>
  );
}

export default CreateNew;