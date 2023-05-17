import FaceLandmarkManager from "@/class/FaceLandmarkManager";
import { useEffect, useRef } from "react";

interface DrawLandmarkCanvasProps {
  width: number;
  height: number;
}
const DrawLandmarkCanvas = ({ width, height }: DrawLandmarkCanvasProps) => {
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef(0);

  const animate = () => {
    if (drawCanvasRef.current) {
      drawCanvasRef.current.width = width;
      drawCanvasRef.current.height = height;
      const faceLandmarkManager = FaceLandmarkManager.getInstance();
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
      style={{ width: width, height: height, transform: "scaleX(-1)" }}
      ref={drawCanvasRef}
    ></canvas>
  );
};

export default DrawLandmarkCanvas;
