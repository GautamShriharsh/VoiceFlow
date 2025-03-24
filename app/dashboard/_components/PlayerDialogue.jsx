"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Player } from "@remotion/player";
import RemotionVideo from './RemotionVideo';
import { Button } from '@/components/ui/button';
import { VideoData } from '@/configs/schema';
import { db } from '@/configs/db';
import { eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';

function PlayerDialogue({ playVideo, videoId, onClose }) {
  const [openDialogue, setOpenDialogue] = useState(false);
  const [videoData, setVideoData] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setOpenDialogue(playVideo);
    if (videoId) {
      GetVideoData();
    }
  }, [playVideo, videoId]);

  const GetVideoData = async () => {
    try {
      setLoading(true);
      const result = await db.select().from(VideoData).where(eq(VideoData.id, videoId));
      setVideoData(result[0]);
    } catch (error) {
      console.error('Error fetching video data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDurationInFrames = () => {
    if (!videoData?.captions?.length) return 120;
    const fps = 30;
    const lastCaptionEndTime = videoData.captions[videoData.captions.length - 1].end;
    return Math.ceil((lastCaptionEndTime / 1000) * fps) + 30;
  };

  const handleClose = () => {
    setOpenDialogue(false);
    onClose(); // Notify VideoList to reset state
  };

  return (
    <Dialog open={openDialogue} onOpenChange={handleClose}>
      <DialogContent className="bg-white flex flex-col items-center max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold my-3">Your video is ready</DialogTitle>
          <DialogDescription className="text-center">
            {loading
              ? "Loading video..."
              : videoData
              ? "Here is your video:"
              : "No video data available"}
          </DialogDescription>
        </DialogHeader>
        {videoData && !loading && (
          <div className="mt-2">
            <Player
              component={RemotionVideo}
              durationInFrames={getDurationInFrames()}
              compositionWidth={300}
              compositionHeight={450}
              fps={30}
              controls={true}
              inputProps={{ ...videoData }}
            />
          </div>
        )}
        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button className="ml-2">Export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PlayerDialogue;