import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import AvatarManager from "@/class/AvatarManager";
import { OrbitControls } from "@react-three/drei";
import FaceLandmarkManager from "@/class/FaceLandmarkManager";
import { Float, Text3D } from "@react-three/drei";

interface AvatarCanvasProps {
  width: number;
  height: number;
  url: string;
}

const AvatarCanvas = ({ width, height, url }: AvatarCanvasProps) => {
  const [scene, setScene] = useState<THREE.Scene | null>();
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
    setScene(null);
    const avatarManager = AvatarManager.getInstance();
    avatarManager.loadModel(url).then(() => {
      setScene(avatarManagerRef.current.getScene());
    });
  }, [url]);

  return (
    <div className="absolute" style={{ width: width, height: height }}>
      <Canvas camera={{ fov: 30, position: [0, 0.5, 1] }}>
        <ambientLight />
        <directionalLight />
        <OrbitControls
          target={[0, 0.6, 0]}
          enableDamping={false}
          enableRotate={false}
          enableZoom={false}
          enablePan={false}
        />
        {scene ? (
          <primitive object={scene} />
        ) : (
          <Float floatIntensity={1} speed={1}>
            <Text3D
              font={"../assets/fonts/Open_Sans_Condensed_Bold.json"}
              scale={0.05}
              position={[-0.1, 0.6, 0]}
              bevelEnabled
              bevelSize={0.05}
            >
              Loading...
              <meshNormalMaterial />
            </Text3D>
          </Float>
        )}
      </Canvas>
    </div>
  );
};

export default AvatarCanvas;
