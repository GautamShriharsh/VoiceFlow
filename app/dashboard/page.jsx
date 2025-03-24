"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/configs/db';
import { VideoData } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import VideoList from './_components/VideoList';
import PlayerDialogue from './_components/PlayerDialogue'; // Adjust path

export default function Dashboard() {
  const [videoList, setVideoList] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserVideos();
    }
  }, [user]);

  const fetchUserVideos = async () => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(VideoData)
        .where(eq(VideoData.createdBy, user.primaryEmailAddress?.emailAddress));
      console.log('Fetched videos:', result);
      setVideoList(result);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Dashboard</h2>
        <button className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600">
          Create New
        </button>
      </div>
      <VideoList videoList={videoList}  />
    </div>
  );
}