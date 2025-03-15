import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Player } from "@remotion/player";
import RemotionVideo from './RemotionVideo';
import { Button } from '@/components/ui/button';
import { VideoData } from '@/configs/schema';
import { db } from '@/configs/db';
import { eq } from 'drizzle-orm';



function PlayerDialogue({playVideo,videoId}) {
    
    const [openDialogue,setOpenDialogue] = useState(false);
    const [videoData, setVideoData] = useState();

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

    
    return (
        <Dialog open={openDialogue} >
        <DialogContent className='bg-white flex flex-col items-center'>
          <DialogHeader>
            <DialogTitle className='text-3xl font-bold my-5'>Your video is ready</DialogTitle>
            <DialogDescription>
              <Player
                component={RemotionVideo}
                durationInFrames={120}
                compositionWidth={300}
                compositionHeight={450}
                fps={30}
                inputProps={
                  {
                    ...videoData
                  }
                }
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='mt-4'>
            <Button variant="outline" >
              Cancel
            </Button>
            <Button className='ml-2' >
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    )
}

export default PlayerDialogue