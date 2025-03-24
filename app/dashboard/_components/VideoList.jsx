"use client";

import React, { useState } from 'react';
import { Thumbnail } from '@remotion/player';
import RemotionVideo from './RemotionVideo';
import PlayerDialogue from './PlayerDialogue';

function VideoList({ videoList }) {
  console.log('VideoList received:', videoList);
  const [openPlayerDialogue, setOpenPlayerDialogue] = useState(false);
  const [videoId, setVideoId] = useState();

  const handleOpenDialogue = (id) => {
    setVideoId(id);
    setOpenPlayerDialogue(true); // Use boolean
  };

  const handleCloseDialogue = () => {
    setOpenPlayerDialogue(false);
    setVideoId(undefined); // Optional: clear videoId
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">Your Videos</h2>
      {videoList?.length === 0 ? (
        <p className="text-center text-gray-500">No videos available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videoList.map((video, index) => (
            <div
              key={video.id || index}
              className="cursor-pointer hover:scale-105 transition-all bg-white rounded-[15px] shadow-md overflow-hidden"
              onClick={() => handleOpenDialogue(video.id)}
            >
              <Thumbnail
                component={RemotionVideo}
                compositionWidth={250}
                compositionHeight={350}
                frameToDisplay={30}
                durationInFrames={120}
                fps={30}
                inputProps={{
                  ...video,
                  setDurationInFrame: (v) => console.log(`Video ${video.id} duration: ${v}`),
                }}
              />
            </div>
          ))}
        </div>
      )}
      <PlayerDialogue
        playVideo={openPlayerDialogue}
        videoId={videoId}
        onClose={handleCloseDialogue} // Pass close handler
      />
    </div>
  );
}

export default VideoList;