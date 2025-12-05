"use client"
import React, { useRef, useEffect, useState } from 'react';

const VideoSection = () => {
  // Refs for video elements
  const videoCenterRef = useRef<HTMLVideoElement | null>(null);
  const videoLeftRef = useRef<HTMLVideoElement | null>(null);
  const videoRightRef = useRef<HTMLVideoElement | null>(null);
  const reverseIntervalRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handle desktop video setup
  useEffect(() => {
    if (isMobile) {
      // On mobile, only setup center video
      const vCenter = videoCenterRef.current;
      
      function handleCenterMeta() {
        try {
          if (vCenter && vCenter.duration && !isNaN(vCenter.duration)) {
            vCenter.currentTime = 0;
            vCenter.play().catch(() => {});
            vCenter.loop = true;
          }
        } catch (e) {
          console.error('Center video setup error', e);
        }
      }

      if (vCenter) {
        vCenter.addEventListener('loadedmetadata', handleCenterMeta);
        if (vCenter.readyState >= 1) handleCenterMeta();
      }

      return () => {
        if (vCenter) vCenter.removeEventListener('loadedmetadata', handleCenterMeta);
      };
    } else {
      // On desktop, setup all three videos
      const vLeft = videoLeftRef.current;
      const vCenter = videoCenterRef.current;
      const vRight = videoRightRef.current;

      function handleLeftMeta() {
        try {
          if (vLeft && vLeft.duration && !isNaN(vLeft.duration)) {
            vLeft.currentTime = Math.max(0, vLeft.duration / 2);
            vLeft.play().catch(() => {});
            vLeft.loop = true;
          }
        } catch (e) {
          console.error('Left video setup error', e);
        }
      }

      function handleCenterMeta() {
        try {
          if (vCenter && vCenter.duration && !isNaN(vCenter.duration)) {
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
            vRight.currentTime = Math.max(0, vRight.duration - 0.05);
            vRight.pause();

            // Start reverse loop
            const step = 1 / 30;
            reverseIntervalRef.current = window.setInterval(() => {
              if (!vRight) return;
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

      // Add event listeners
      if (vLeft) vLeft.addEventListener('loadedmetadata', handleLeftMeta);
      if (vCenter) vCenter.addEventListener('loadedmetadata', handleCenterMeta);
      if (vRight) vRight.addEventListener('loadedmetadata', handleRightMeta);

      // Check if already loaded
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
    }
  }, [isMobile]);

  return (
    <div className="w-full bg-black text-white font-sans">
      {/* ================= VIDEO SECTION ================= */}
      <div className="w-full bg-black overflow-hidden">
        {/* For mobile: Only show center video */}
        {isMobile ? (
          <div className="w-full h-[360px] overflow-hidden">
            <video
              ref={videoCenterRef}
              className="w-full h-full object-cover"
              src="/video1.mp4"
              muted
              playsInline
              autoPlay
              loop
              preload="metadata"
            />
          </div>
        ) : (
          /* For desktop: Show all three videos */
          <div className="grid grid-cols-3 gap-0 w-full h-[520px]">
            {/* Left video */}
            <div className="w-full h-full overflow-hidden">
              <video
                ref={videoLeftRef}
                className="w-full h-full object-cover"
                src="/video1.mp4"
                muted
                playsInline
                preload="metadata"
              />
            </div>

            {/* Center video */}
            <div className="w-full h-full overflow-hidden">
              <video
                ref={videoCenterRef}
                className="w-full h-full object-cover"
                src="/video1.mp4"
                muted
                playsInline
                preload="metadata"
              />
            </div>

            {/* Right video */}
            <div className="w-full h-full overflow-hidden">
              <video
                ref={videoRightRef}
                className="w-full h-full object-cover"
                src="/video1.mp4"
                muted
                playsInline
                preload="metadata"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoSection;