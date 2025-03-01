'use client';

import React, { useState } from 'react';
import SelectTopic from './_components/SelectTopic';
import SelectStyle from './_components/SelectStyle';

function CreateNew() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');

  return (
    <div className='md:px-20'>
      <h2 className='font-bold text-4xl text-primary text-center mt-6'>Create new</h2>
      <div className='mt-8'>
        <SelectTopic onTopicChange={setSelectedTopic} />
      </div>
      <div className='mt-8'>
        <SelectStyle onStyleChange={setSelectedStyle} />
      </div>
      
    </div>
  );
}

export default CreateNew;