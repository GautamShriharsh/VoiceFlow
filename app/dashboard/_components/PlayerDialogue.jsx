import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Player } from "@remotion/player";
import RemotionVideo from './RemotionVideo';
import { Button } from '@/components/ui/button';
import { VideoData } from '@/configs/schema';
import { db } from '@/configs/db';
import { eq } from 'drizzle-orm';

function PlayerDialogue({ playVideo, videoId }) {
    const [openDialogue, setOpenDialogue] = useState(false);
    const [videoData, setVideoData] = useState();
    const [loading, setLoading] = useState(false);

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

    // Ensure video plays till the last caption
    const getDurationInFrames = () => {
        if (!videoData?.captions?.length) return 120; // Default duration

        const fps = 30;
        const lastCaptionEndTime = videoData.captions[videoData.captions.length - 1].end;

        return Math.ceil((lastCaptionEndTime / 1000) * fps) + 30; // Extra 30 frames buffer
    };

    return (
        <Dialog open={openDialogue} onOpenChange={setOpenDialogue}>
            <DialogContent className="bg-white flex flex-col items-center">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold my-5">Your video is ready</DialogTitle>
                    <DialogDescription>
                        {loading ? (
                            <p>Loading video...</p>
                        ) : videoData ? (
                            <Player
                                component={RemotionVideo}
                                durationInFrames={getDurationInFrames()}
                                compositionWidth={300}
                                compositionHeight={450}
                                fps={30}
                                controls={true}
                                inputProps={{ ...videoData }}
                            />
                        ) : (
                            <p>No video data available</p>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setOpenDialogue(false)}>Cancel</Button>
                    <Button className="ml-2">Export</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default PlayerDialogue;
