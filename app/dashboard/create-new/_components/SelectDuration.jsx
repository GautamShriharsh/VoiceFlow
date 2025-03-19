'use client'; // Mark as Client Component for useState and event handling

import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function SelectDuration({ onDurationChange }) {
  const [selectedDuration, setSelectedDuration] = useState('');

  const handleDurationChange = (value) => {
    setSelectedDuration(value);
    if (onDurationChange) onDurationChange(value); // Pass duration to parent
  };

  return (
    <div className='shadow-md p-4 rounded-lg bg-white mt-4'>
      <h3 className='text-primary text-2xl font-semibold mb-2'>Duration</h3>
      <p className='text-sm text-gray-600 mb-4'>Select the duration of your video</p>
      <Select onValueChange={handleDurationChange} value={selectedDuration}>
        <SelectTrigger className='w-full max-w-xs'>
          <SelectValue placeholder="Select duration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5 seconds</SelectItem>
          <SelectItem value="30">30 seconds</SelectItem>
          <SelectItem value="60">60 seconds</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectDuration;