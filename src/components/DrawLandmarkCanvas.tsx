"use client";

import FaceLandmarkManager from "@/class/FaceLandmarkManager";
import { useEffect, useRef, useState } from "react";

const DrawLandmarkCanvas = () => {
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef(0);

  const animate = () => {
    const faceLandmarkManager = FaceLandmarkManager.getInstance();
    if (drawCanvasRef.current) {
      faceLandmarkManager.drawLandmarks(drawCanvasRef.current);
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <canvas
      className="absolute"
      style={{ width: 640, height: 480, transform: "scaleX(-1)" }}
      ref={drawCanvasRef}
    ></canvas>
  );
};

export default DrawLandmarkCanvas;
