"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DrawLandmarkCanvas from "./DrawLandmarkCanvas";
import AvatarCanvas from "./AvatarCanvas";
import FaceLandmarkManager from "@/class/FaceLandmarkManager";
import ReadyPlayerCreator from "./ReadyPlayerCreator";

const FaceLandmarkCanvas = () => {
  const videoRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);
  const requestRef = useRef(0);
  const [avatarView, setAvatarView] = useState(true);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  const [modelUrl, setModelUrl] = useState(
    "https://models.readyplayer.me/6460691aa35b2e5b7106734d.glb?morphTargets=ARKit"
  );
  const [videoSize, setVideoSize] = useState<{
    width: number;
    height: number;
  }>();

  const toggleAvatarView = () => setAvatarView((prev) => !prev);
  const toggleAvatarCreatorView = () => setShowAvatarCreator((prev) => !prev);
  const handleAvatarCreationComplete = (url: string) => {
    setModelUrl(url);
    toggleAvatarCreatorView();
  };

  const animate = () => {
    if (videoRef.current) {
      const video = videoRef.current as HTMLVideoElement;
      const nowInMs = Date.now();
      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;
        try {
          const faceLandmarkManager = FaceLandmarkManager.getInstance();
          faceLandmarkManager.detectLandmarks(videoRef.current, nowInMs);
        } catch (e) {
          console.log(e);
        }
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const getUserCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          const video = videoRef.current as HTMLVideoElement;
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            setVideoSize({
              width: video.offsetWidth,
              height: video.offsetHeight,
            });
            video.play();
          };
        }
      } catch (e) {
        console.log(e);
        alert("Failed to load webcam!");
      }
    };
    getUserCamera();
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center gap-10 mt-5 mb-10">
        <button
          className="self-end bg-purple-700 hover:bg-purple-600 transition text-white px-2 py-1 rounded mb-2 shadow-md text-sm sm:text-base"
          onClick={toggleAvatarView}
        >
          {avatarView ? "Switch to Landmark View" : "Switch to Avatar View"}
        </button>
        <button
          className="self-end bg-purple-700 hover:bg-purple-600 transition text-white px-2 py-1 rounded mb-2 shadow-md text-sm sm:text-base"
          onClick={toggleAvatarCreatorView}
        >
          {"Customize your Avatar!"}
        </button>
      </div>
      <div className="flex justify-center">
        <video
          className="w-full h-auto"
          ref={videoRef}
          loop={true}
          muted={true}
          autoPlay={true}
          playsInline={true}
        ></video>
        {videoSize && (
          <>
            {showAvatarCreator && (
              <ReadyPlayerCreator
                width={videoSize.width}
                height={videoSize.height}
                handleComplete={handleAvatarCreationComplete}
              />
            )}
            {avatarView ? (
              <AvatarCanvas
                width={videoSize.width}
                height={videoSize.height}
                url={modelUrl}
              />
            ) : (
              <DrawLandmarkCanvas
                width={videoSize.width}
                height={videoSize.height}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FaceLandmarkCanvas;
