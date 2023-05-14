"use client";

import { useEffect, useRef, useState } from "react";
import DrawLandmarkCanvas from "./DrawLandmarkCanvas";
import AvatarCanvas from "./AvatarCanvas";
import FaceLandmarkManager from "@/class/FaceLandmarkManager";
import AvatarManager from "@/class/AvatarManager";

const modelUrl =
  "https://models.readyplayer.me/6460691aa35b2e5b7106734d.glb?morphTargets=ARKit";
const videoWidth = 640;
const videoHeight = 480;

const FaceLandmarkCanvas = () => {
  const videoRef = useRef(null);
  const requestRef = useRef(0);
  const [avatarView, setAvatarView] = useState(true);

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
    const loadModel = async () => {
      const avatarManager = AvatarManager.getInstance();
      await avatarManager.loadModel(modelUrl);
    };
    loadModel();
  }, []);

  useEffect(() => {
    const getUserCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: videoWidth, height: videoHeight },
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
        {avatarView ? "Switch to Landmark View" : "Switch to Avatar View"}
      </button>
      <div className="flex justify-center">
        <video
          className="absolute"
          style={{ width: videoWidth, height: videoHeight }}
          ref={videoRef}
        ></video>
        {avatarView ? (
          <AvatarCanvas />
        ) : (
          <DrawLandmarkCanvas width={videoWidth} height={videoHeight} />
        )}
      </div>
    </div>
  );
};

export default FaceLandmarkCanvas;
