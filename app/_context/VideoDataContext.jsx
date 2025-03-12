// app/_context/VideoDataContext.js
import { createContext, useState, useContext } from 'react';

export const VideoDataContext = createContext();

export const VideoDataProvider = ({ children }) => {
  const [videoData, setVideoData] = useState({
    videoScript: [],
    audioFileUrl: '',
    captions: '',
    imageList: [],
  });

  return (
    <VideoDataContext.Provider value={{ videoData, setVideoData }}>
      {children}
    </VideoDataContext.Provider>
  );
};

// Custom hook to use the context
export const useVideoData = () => useContext(VideoDataContext);