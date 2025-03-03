'use client';

import React, { useState } from 'react';
import SelectTopic from './_components/SelectTopic';
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import axios from 'axios';

function CreateNew() {
  // Single state object to hold all form data
  const [formData, setFormData] = useState({
    topic: '',
    style: '',
    duration: '',
  });

  // Handler to update formData
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onCreateVideoHandler = () => {
    GetVideoScript();
  }
  
  //Get Video script
   const GetVideoScript = async () => {
    const prompt = `Write a script to generate ${formData.duration} seconds video on topic : ${formData.topic} along with AI image prompt in ${formData.style} format for each scene and give me result in JSON format with imagePrompt and ContentText as field, No Plain text.`
    // console.log(prompt);
    
     const result = await axios.post('/api/get-video-script', {
       prompt: prompt
      }).then(res => {
        console.log(res.data);
      })
   }

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
          className='bg-purple-500 text-white px-8 py-2 rounded-md hover:bg-purple-600 transition-colors w-full ' // Increased padding and matched width
          //onClick={handleCreateVideo}
          onClick={onCreateVideoHandler}
          disabled={!formData.topic || !formData.style || !formData.duration}
        >
          Create Short Video
        </button>
      </div>
    </div>
  );
}

export default CreateNew;