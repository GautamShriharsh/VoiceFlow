'use client';

import React, { useState } from 'react';
import SelectTopic from './_components/SelectTopic';
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import axios from 'axios';
import CustomLoading from './_components/CustomLoading';
import { v4 as uuidv4 } from 'uuid';
import { useVideoData } from '@/app/_context/VideoDataContext';

function CreateNew() {
  const { videoData, setVideoData } = useVideoData();
  const [formData, setFormData] = useState({
    topic: '',
    style: '',
    duration: '',
  });
  const [loadingCount, setLoadingCount] = useState(0); // Track active tasks
  const loading = loadingCount > 0; // Derive loading state from count

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onCreateVideoHandler = async () => {
    if (formData.topic && formData.style && formData.duration) {
      await GetVideoScript();
    } else {
      alert('Please fill all fields (Topic, Style, Duration)!');
    }
  };

  const GetVideoScript = async () => {
    setLoadingCount((prev) => prev + 1); // Increment for this task
    const prompt = `Write a script for a ${formData.duration}-second video on topic: ${formData.topic} along with AI image prompts in ${formData.style} format for each scene and a single cohesive voiceover script narrating the entire story. Return the result in JSON format with imagePrompt, contentText, and voiceover as fields, no plain text.`;

    try {
      const response = await axios.post('/api/get-video-script', { prompt });
      const scriptData = response.data.result;
      if (Array.isArray(scriptData)) {
        setVideoData((prev) => ({
          ...prev,
          videoScript: scriptData,
        }));
        const generatedAudioUrl = await GenerateAudioFile(scriptData);
        if (generatedAudioUrl) {
          console.log('This is the generated Audio Url:', generatedAudioUrl);
          await GenerateAudioCaption(generatedAudioUrl);
        } else {
          throw new Error('Failed to generate audio file URL');
        }
        await GenerateImage(scriptData);
      } else {
        console.error('Invalid response format: expected an array', scriptData);
        setVideoData((prev) => ({
          ...prev,
          videoScript: [],
        }));
      }
    } catch (error) {
      console.error('Error in GetVideoScript:', error.message);
    } finally {
      setLoadingCount((prev) => prev - 1); // Decrement regardless of success or failure
    }
  };

  const GenerateAudioCaption = async (fileUrl) => {
    setLoadingCount((prev) => prev + 1); // Increment for this task
    if (!fileUrl) {
      console.error('No audio file URL provided');
      setLoadingCount((prev) => prev - 1); // Decrement if no URL
      return;
    }

    try {
      const response = await axios.post('/api/generate-caption', { audioFileUrl: fileUrl });
      console.log('Caption result:', response.data.result);
      setVideoData((prev) => ({
        ...prev,
        captions: response.data.result,
      }));
    } catch (error) {
      console.error('Error generating caption:', error.message);
    } finally {
      setLoadingCount((prev) => prev - 1); // Decrement regardless of success or failure
    }
  };

  const GenerateAudioFile = async (videoScript) => {
    setLoadingCount((prev) => prev + 1); // Increment for this task
    if (!Array.isArray(videoScript)) {
      console.error('videoScript is not an array:', videoScript);
      setLoadingCount((prev) => prev - 1); // Decrement on error
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
      const response = await axios.post('/api/generate-audio', { text: voiceoverScript, id });
      const audioUrl = response.data.downloadUrl;
      if (audioUrl) {
        setVideoData((prev) => ({
          ...prev,
          audioFileUrl: audioUrl,
        }));
        return audioUrl;
      } else {
        console.error('No valid URL in response:', response.data);
        return null;
      }
    } catch (error) {
      console.error('Error generating audio file:', error.message, error.response?.data);
      return null;
    } finally {
      setLoadingCount((prev) => prev - 1); // Decrement regardless of success or failure
    }
  };

  const GenerateImage = async (scriptData) => {
    setLoadingCount((prev) => prev + 1); // Increment for this task
    if (!Array.isArray(scriptData)) {
      console.error('scriptData is not an array:', scriptData);
      setLoadingCount((prev) => prev - 1); // Decrement on error
      return;
    }
    try {
      const imagePromises = scriptData.map(async (element) => {
        const response = await axios.post('/api/generate-image', { imagePrompt: element.imagePrompt });
        return response.data.image; // Returns firebase download URL
      });
      const generatedImages = await Promise.all(imagePromises);
      setVideoData((prev) => ({
        ...prev,
        imageList: generatedImages,
      }));
    } catch (error) {
      console.error('Error generating images:', error.message);
    } finally {
      setLoadingCount((prev) => prev - 1); // Decrement regardless of success or failure
    }
  };

  return (
    <div className='md:px-20'>
      <h2 className='font-bold text-4xl text-primary text-center mt-6'>Create new</h2>
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
          disabled={!formData.topic || !formData.style || !formData.duration}
        >
          Create Short Video
        </button>
      </div>
      {/* Display generated images */}
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
    </div>
  );
}

export default CreateNew;