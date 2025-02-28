"use client"

import React, { useState } from 'react'
import EmptyState from './_components/EmptyState';

export default function Dashboard() {
  const [videoList, setVideoList] = useState([]);
 
  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-primary'>Dashboard</h2>
        <button className='bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600'>
          Create New
        </button>
      </div>
      {/* Conditionally render EmptyState if videoList is empty */}
      {videoList.length === 0 ? <EmptyState /> : <div>Video list content here</div>}
    </div>
  );
}