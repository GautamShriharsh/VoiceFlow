'use client'; // Mark as Client Component for useState and event handling

import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

function SelectTopic({ onTopicChange }) {
  // State for options and custom prompt
  const [options, setOptions] = useState([
    { value: 'technology', label: 'Technology' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'health', label: 'Health' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'custom', label: 'Custom' },
  ]);
  const [selectedValue, setSelectedValue] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  // Handle custom prompt submission
  const handleCustomPrompt = () => {
    if (customPrompt.trim() && selectedValue === 'custom') {
      onTopicChange(customPrompt); // Pass custom prompt to parent
      setSelectedValue(customPrompt); // Update selected value
      setCustomPrompt(''); // Clear textarea
    }
  };

  // Update parent whenever select value changes
  const handleSelectChange = (value) => {
    setSelectedValue(value);
    if (value !== 'custom') {
      onTopicChange(value); // Pass select value to parent
    }
  };

  return (
    <div className='shadow-md p-4 rounded-lg bg-white '>
      <h3 className='text-primary text-2xl font-semibold mb-2'>Content</h3>
      <p className='text-sm text-gray-600 mb-4'>What is the topic of your video?</p>
      <Select onValueChange={handleSelectChange} value={selectedValue}>
        <SelectTrigger className='w-full max-w-xs'>
          <SelectValue placeholder="Select a topic" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedValue === 'custom' && (
        <div className='mt-4'>
          <Textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder='Enter your custom topic or detailed prompt'
            className='w-full max-w-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
          <button
            onClick={handleCustomPrompt}
            className='mt-2 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600'
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default SelectTopic;