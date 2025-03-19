// @/app/_context/VideoDataContext.js
import React, { createContext, useContext, useState } from 'react';

const VideoDataContext = createContext();

export function VideoDataProvider({ children }) {
  const [videoData, setVideoData] = useState({
    videoScript: [],
    audioFileUrl: '',
    captions: [],
    imageList: [],
  });

  return (
    <VideoDataContext.Provider value={{ videoData, setVideoData }}>
      {children}
    </VideoDataContext.Provider>
  );
}

export function useVideoData() {
  const context = useContext(VideoDataContext);
  if (!context) {
    throw new Error('useVideoData must be used within a VideoDataProvider');
  }
  return context;
}