"use client";

import FaceLandmarkManager from "@/class/FaceLandmarkManager";
import { useEffect, useRef, useState } from "react";
import DrawLandmarkCanvas from "./DrawLandmarkCanvas";
import AvatarCanvas from "./AvatarCanvas";

const FaceLandmarkCanvas = () => {
  const videoRef = useRef(null);
  const requestRef = useRef(0);
  const [avatarView, setAvatarView] = useState(false);

  const toggleAvatarView = () => {
    setAvatarView((prev) => !prev);
  };

  const animate = () => {
    const faceLandmarkManager = FaceLandmarkManager.getInstance();
    if (videoRef.current && faceLandmarkManager.faceLandmarker) {
      try {
        faceLandmarkManager.detectLandmarks(videoRef.current, Date.now());
      } catch (e) {
        console.log(e);
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  useEffect(() => {
    const getUserCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });
        if (videoRef.current) {
          const video = videoRef.current as HTMLVideoElement;
          video.srcObject = stream;
          video.play();
        }
      } catch (e) {
        console.log(e);
        alert("Failed to load webcam!");
      }
    };
    getUserCamera();
  }, [videoRef]);

  return (
    <div>
      <button
        className="self-end bg-blue-500 text-white px-2 py-1 rounded mb-4"
        onClick={toggleAvatarView}
      >
        {avatarView ? "Switch to Video View" : "Switch to Avatar View"}
      </button>
      <div className="flex justify-center">
        <video
          className="absolute"
          style={{ width: 640, height: 480 }}
          ref={videoRef}
        ></video>
        {avatarView ? <AvatarCanvas /> : <DrawLandmarkCanvas />}
      </div>
    </div>
  );
};

export default FaceLandmarkCanvas;
