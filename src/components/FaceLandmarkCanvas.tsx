"use client";

import FaceLandmarkManager from "@/class/FaceLandmarkManager";
import { useEffect, useRef } from "react";

const FaceLandmarkCanvas = () => {
  const videoRef = useRef(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef(0);

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

  const animate = () => {
    const faceLandmarkManager = FaceLandmarkManager.getInstance();
    if (
      videoRef.current &&
      faceLandmarkManager &&
      faceLandmarkManager.faceLandmarker
    ) {
      try {
        const results = faceLandmarkManager.detectLandmarks(
          videoRef.current,
          Date.now()
        );
        if (drawCanvasRef.current) {
          faceLandmarkManager.drawLandmarks(drawCanvasRef.current);
        }
        console.log(results);
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

  return (
    <>
      <video
        className="absolute top-0 left-0"
        style={{ width: 640, height: 480 }}
        ref={videoRef}
      ></video>
      <canvas
        className="absolute top-0 left-0"
        style={{ width: 640, height: 480, transform: "scaleX(-1)" }}
        ref={drawCanvasRef}
      ></canvas>
    </>
  );
};

export default FaceLandmarkCanvas;
