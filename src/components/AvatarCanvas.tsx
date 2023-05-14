import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import AvatarManager from "@/class/AvatarManager";
import { OrbitControls } from "@react-three/drei";
import FaceLandmarkManager from "@/class/FaceLandmarkManager";

const AvatarCanvas = () => {
  const [scene, setScene] = useState<THREE.Scene>();
  const avatarManagerRef = useRef<AvatarManager>(AvatarManager.getInstance());
  const requestRef = useRef(0);

  const animate = () => {
    const results = FaceLandmarkManager.getInstance().getResults();
    avatarManagerRef.current.updateFacialTransforms(results, true);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  useEffect(() => {
    setScene(avatarManagerRef.current.getScene());
  }, []);

  return (
    <div className="absolute" style={{ width: 640, height: 480 }}>
      <Canvas camera={{ fov: 30, position: [0, 0.5, 1] }}>
        <ambientLight />
        <directionalLight />
        <OrbitControls target={[0, 0.6, 0]} />
        {scene && <primitive object={scene} />}
      </Canvas>
    </div>
  );
};

export default AvatarCanvas;
