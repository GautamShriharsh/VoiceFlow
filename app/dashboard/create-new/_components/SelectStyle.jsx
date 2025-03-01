'use client'; 
import React, { useState } from 'react';
import Image from 'next/image';

function SelectStyle({ onStyleChange }) {
  const styleOptions = [
    { name: 'Realistic', image: '/realistic.jpg' },
    { name: 'Cartoon', image: '/cartoon.jpg' },
    { name: 'Comic', image: '/comic.jpg' },
    { name: 'WaterColor', image: '/watercolor.jpg' },
    { name: 'GTA', image: '/gta.jpg' },
  ];

  const [selectedStyle, setSelectedStyle] = useState('');

  const handleStyleClick = (name) => {
    setSelectedStyle(name);
    if (onStyleChange) onStyleChange(name); // Pass selected style to parent
  };

  return (
    <div className='shadow-md p-4 rounded-lg bg-white mt-4'>
      <h3 className='text-primary text-2xl font-semibold mb-2'>Style</h3>
      <p className='text-sm text-gray-600 mb-4'>Choose the style of your video</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1'> {/* Responsive grid */}
        {styleOptions.map((option) => (
          <div
            key={option.name}
            className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-300 ${
              selectedStyle === option.name
                ? 'border-purple-600 scale-105 shadow-lg'
                : 'border-gray-200 hover:border-purple-300'
            }`}
            style={{ width: '150px', height: '200px', position: 'relative' }}
            onClick={() => handleStyleClick(option.name)}
          >
            <Image
              src={option.image}
              alt={`${option.name} style preview`}
              width={150}
              height={200}
              className='w-full h-full object-cover'
            />
            <div
              className='absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-xs font-medium text-center p-1 mb-0'
              style={{ height: '25px', lineHeight: '20px', boxSizing: 'border-box' }}
            >
              {option.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectStyle;