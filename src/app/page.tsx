import Head from "next/head";
import FaceLandmarkCanvas from "../components/FaceLandmarkCanvas";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-2 pt-10">
      <Head>
        <title>Mediapie FaceLandmarker Demo</title>
      </Head>
      <h1 className="text-2xl font-bold mb-4">Mediapie FaceLandmarker Demo</h1>
      <p className="mt-4 mb-8 text-center px-4">
        Detect the most prominent face from an input image, then estimate 478 3D
        facial landmarks and 52 facial blendshape scores in real-time.
      </p>
      <FaceLandmarkCanvas />
    </div>
  );
}
