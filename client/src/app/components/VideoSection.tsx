"use client"
import React, { useRef, useEffect } from 'react';

const VideoSection = () => {
  // Refs for the three video elements
  const videoLeftRef = useRef<HTMLVideoElement | null>(null);
  const videoCenterRef = useRef<HTMLVideoElement | null>(null);
  const videoRightRef = useRef<HTMLVideoElement | null>(null);
  // Store interval id for reverse playback
  const reverseIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const vLeft = videoLeftRef.current;
    const vCenter = videoCenterRef.current;
    const vRight = videoRightRef.current;

    function handleLeftMeta() {
      try {
        if (vLeft && vLeft.duration && !isNaN(vLeft.duration)) {
          vLeft.currentTime = Math.max(0, vLeft.duration / 2);
          // Play; autoplay policies require muted to be true which is set
          vLeft.play().catch(() => {});
          vLeft.loop = true;
        }
      } catch (e) {
        console.error('Left video setup error', e);
      }
    }

    function handleCenterMeta() {
      try {
        if (vCenter) {
          vCenter.currentTime = 0;
          vCenter.play().catch(() => {});
          vCenter.loop = true;
        }
      } catch (e) {
        console.error('Center video setup error', e);
      }
    }

    function handleRightMeta() {
      try {
        if (vRight && vRight.duration && !isNaN(vRight.duration)) {
          // Start near the end
          vRight.currentTime = Math.max(0, vRight.duration - 0.05);
          // Pause native playback; we'll drive reverse playback manually
          vRight.pause();

          // Start reverse loop at ~30fps
          const step = 1 / 30; // seconds per tick
          reverseIntervalRef.current = window.setInterval(() => {
            if (!vRight) return;
            // Decrement time; if at beginning, wrap to end to loop
            if (vRight.currentTime <= 0.05) {
              vRight.currentTime = Math.max(0, vRight.duration - 0.05);
            } else {
              vRight.currentTime = Math.max(0, vRight.currentTime - step);
            }
          }, 33);
        }
      } catch (e) {
        console.error('Right video setup error', e);
      }
    }

    if (vLeft) vLeft.addEventListener('loadedmetadata', handleLeftMeta);
    if (vCenter) vCenter.addEventListener('loadedmetadata', handleCenterMeta);
    if (vRight) vRight.addEventListener('loadedmetadata', handleRightMeta);

    // In case metadata already loaded
    if (vLeft && vLeft.readyState >= 1) handleLeftMeta();
    if (vCenter && vCenter.readyState >= 1) handleCenterMeta();
    if (vRight && vRight.readyState >= 1) handleRightMeta();

    return () => {
      if (vLeft) vLeft.removeEventListener('loadedmetadata', handleLeftMeta);
      if (vCenter) vCenter.removeEventListener('loadedmetadata', handleCenterMeta);
      if (vRight) vRight.removeEventListener('loadedmetadata', handleRightMeta);
      if (reverseIntervalRef.current) {
        clearInterval(reverseIntervalRef.current);
        reverseIntervalRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full bg-black text-white font-sans">
      {/* ================= VIDEO SECTION ================= */}
      {/* Three-part video: left starts from middle, center from start, right from end in reverse */}
      <div className="w-full bg-black overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 w-full h-[360px] md:h-[520px]">
          {/* Left: play from middle */}
          <div className="w-full h-full overflow-hidden">
            <video
              ref={videoLeftRef}
              className="w-full h-full object-cover"
              src="/video1.mp4"
              muted
              playsInline
            />
          </div>

          {/* Center: play from start */}
          <div className="w-full h-full overflow-hidden">
            <video
              ref={videoCenterRef}
              className="w-full h-full object-cover"
              src="/video1.mp4"
              muted
              playsInline
              autoPlay
              loop
            />
          </div>

          {/* Right: play in reverse from end */}
          <div className="w-full h-full overflow-hidden">
            <video
              ref={videoRightRef}
              className="w-full h-full object-cover"
              src="/video1.mp4"
              muted
              playsInline
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
