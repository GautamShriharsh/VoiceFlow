"use client";
import React from 'react';
import { AbsoluteFill, useVideoConfig, Sequence, Img, Audio, useCurrentFrame, interpolate, Easing } from 'remotion';

function RemotionVideo({ imageList, audioFileUrl, captions }) {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Ensure video duration matches captions
  const getDurationFrame = () => {
    if (!captions?.length) return 120; // Default duration if no captions

    const lastCaptionEnd = captions[captions.length - 1].end / 1000;
    return Math.ceil(lastCaptionEnd * fps); // Convert seconds to frames
  };

  const totalDuration = getDurationFrame();

  // Fix: Ensure no gaps by aligning sequence timing
  const getSequenceTiming = (index) => {
    if (!imageList?.length) return { from: 0, duration: totalDuration };

    const numImages = imageList.length;
    const baseDurationPerImage = Math.ceil(totalDuration / numImages);
    const from = index * baseDurationPerImage;
    
    // Ensure the last image extends to the end
    const duration = (index === numImages - 1) ? totalDuration - from : baseDurationPerImage;

    return { from, duration };
  };

  // Fix: Subtle zoom effect for a smooth appearance
  const getScale = (index, from) => {
    const zoomCycleFrames = totalDuration / 2;
    const relativeFrame = frame - from;
    
    return interpolate(
      relativeFrame,
      [0, zoomCycleFrames / 2, zoomCycleFrames],
      [1, 1.1, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease) }
    );
  };

  // Fix: Ensure no black frame between images
  const getOpacity = (index, from, duration) => {
    const fadeFrames = 5; // Reduce to remove gaps
    const relativeFrame = frame - from;
    
    return interpolate(
      relativeFrame,
      [0, fadeFrames, duration - fadeFrames, duration - 1],
      [0, 1, 1, 0], // Ensure image stays fully visible
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.ease }
    );
  };

  // Get the current caption based on frame time
  const getCurrentCaption = () => {
    if (!captions?.length) return '';
    
    const currentTime = (frame / fps) * 1000;
    
    const activeCaption = captions.find(caption => 
      currentTime >= caption.start && currentTime <= caption.end
    );

    return activeCaption?.text || '';
  };

  return (
    <AbsoluteFill className="bg-black">
      {audioFileUrl && <Audio src={audioFileUrl} />}
      
      {imageList?.map((item, index) => {
        const { from, duration } = getSequenceTiming(index);
        
        return (
          <Sequence key={index} from={from} durationInFrames={duration}>
            <Img
              src={item}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${getScale(index, from)})`,
                opacity: getOpacity(index, from, duration),
              }}
            />
          </Sequence>
        );
      })}

      {/* Captions */}
      <div 
        className="absolute bottom-5 left-0 right-0 text-center text-white text-2xl font-sans px-5 leading-tight"
        style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
      >
        {getCurrentCaption()}
      </div>
    </AbsoluteFill>
  );
}

export default RemotionVideo;
