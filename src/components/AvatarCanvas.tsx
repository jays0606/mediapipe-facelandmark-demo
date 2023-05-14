import { Canvas } from "@react-three/fiber";
import { Box } from "@react-three/drei";

const AvatarCanvas = () => {
  return (
    <div className="absolute" style={{ width: 640, height: 480 }}>
      <Canvas camera={{ fov: 35, position: [0, 2, 20] }}>
        <ambientLight />
        <Box></Box>
      </Canvas>
    </div>
  );
};

export default AvatarCanvas;
