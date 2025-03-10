'use client';

import React, { useState } from 'react';
import SelectTopic from './_components/SelectTopic';
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import axios from 'axios';
import CustomLoading from './_components/CustomLoading';
import { v4 as uuidv4 } from 'uuid';

function CreateNew() {
  const [formData, setFormData] = useState({
    topic: '',
    style: '',
    duration: '',
  });

  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [captions, setCaptions] = useState();
  const [generatedImages, setGeneratedImages] = useState([]);

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
    setLoading(true);
    const prompt = `Write a script for a ${formData.duration}-second video on topic: ${formData.topic} along with AI image prompts in ${formData.style} format for each scene and a single cohesive voiceover script narrating the entire story. Return the result in JSON format with imagePrompt, contentText, and voiceover as fields, no plain text.`;

    try {
      const response = await axios.post('/api/get-video-script', { prompt });
      const scriptData = response.data.result;
      if (Array.isArray(scriptData)) {
        setVideoScript(scriptData);
        console.log('Video script generated:', scriptData);
        const generatedAudioUrl = await GenerateAudioFile(scriptData);
        if (generatedAudioUrl) {
          setAudioFileUrl(generatedAudioUrl);
          await GenerateAudioCaption(generatedAudioUrl);
        } else {
          throw new Error('Failed to generate audio file URL');
        }
        await GenerateImage(scriptData);
      } else {
        console.error('Invalid response format: expected an array', scriptData);
        setVideoScript([]);
      }
    } catch (error) {
      console.error('Error in GetVideoScript:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const GenerateAudioCaption = async (fileUrl) => {
    if (!fileUrl) {
      console.error('No audio file URL provided');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/generate-caption', { audioFileUrl: fileUrl });
      console.log('Caption result:', response.data.result);
      setCaptions(response?.data?.result);
    } catch (error) {
      console.error('Error generating caption:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const GenerateAudioFile = async (videoScript) => {
    if (!Array.isArray(videoScript)) {
      console.error('videoScript is not an array:', videoScript);
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
      console.log('GenerateAudioFile response:', response.data);
      const audioUrl = response.data.result || response.data.downloadUrl;
      if (audioUrl) {
        return audioUrl;
      } else {
        console.error('No valid URL in response:', response.data);
        return null;
      }
    } catch (error) {
      console.error('Error generating audio file:', error.message, error.response?.data);
      return null;
    }
  };

  const GenerateImage = async (scriptData) => {
    if (!Array.isArray(scriptData)) {
      console.error('scriptData is not an array:', scriptData);
      return;
    }
    try {
      const imagePromises = scriptData.map(async (element) => {
        const response = await axios.post('/api/generate-image', { imagePrompt: element.imagePrompt });
        return response.data.image; // Returns firebase download URL
      });
      const generatedImages = await Promise.all(imagePromises);
      setGeneratedImages(generatedImages);
      console.log('Generated image URLs:', generatedImages);
    } catch (error) {
      console.error('Error generating images:', error.message);
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
      {generatedImages.length > 0 && (
        <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-4'>
          {generatedImages.map((image, index) => (
            <img
              key={index}
              src={image} // URL from AIGuruLab
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