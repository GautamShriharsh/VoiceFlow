'use client';

import React, { useState } from 'react';
import SelectTopic from './_components/SelectTopic';
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import axios from 'axios';
import CustomLoading from './_components/CustomLoading';
import { v4 as uuidv4 } from 'uuid';


function CreateNew() {
  // Single state object to hold all form data
  const [formData, setFormData] = useState({
    topic: '',
    style: '',
    duration: '',
  });

  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [audioFileUrl,setAudioFileUrl] = useState();

  // Handler to update formData
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

  // Get Video script
  const GetVideoScript = async () => {
    setLoading(true);
    const prompt = `Write a script for a ${formData.duration}-second video on topic: ${formData.topic} along with AI image prompts in ${formData.style} format for each scene and a single cohesive voiceover script narrating the entire story. Return the result in JSON format with imagePrompt, contentText, and voiceover as fields, no plain text.`;

    try {
      const response = await axios.post('/api/get-video-script', { prompt });
      const scriptData = response.data.result; // Store the result
      if (Array.isArray(scriptData)) {
        setVideoScript(scriptData); // Update state with the array
        console.log(videoScript);
        
        await GenerateAudioFile(scriptData); // Pass the result directly
        
      } else {
        console.error('Invalid response format: expected an array', scriptData);
        setVideoScript([]); // Set to empty array as fallback
      }
    } catch (error) {
      console.error('Error fetching video script:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const GenerateAudioFile = async (videoScript) => {
    if (!Array.isArray(videoScript)) {
      console.error('videoScript is not an array:', videoScript);
      return; // Exit if not an array
    }

    let voiceoverScript = '';
    const id = uuidv4();
    videoScript.forEach((item) => {
      if (item && item.voiceover) {
        voiceoverScript += item.voiceover; // Concatenate only if item and voiceOver exist
      }
    });
    console.log(voiceoverScript); // Should now log the concatenated text
    
    await axios.post('/api/generate-audio',{
      text:voiceoverScript,
      id:id
    }).then(res => {
      setAudioFileUrl(res.data.result);
    })
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
      <CustomLoading loading={loading} />
    </div>
  );
}

export default CreateNew;