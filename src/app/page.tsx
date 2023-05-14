"use client";

import Head from "next/head";
import dynamic from "next/dynamic";

// Use dynamic loading to fix document undefined error
const FaceLandmarkCanvas = dynamic(
  () => {
    return import("../components/FaceLandmarkCanvas");
  },
  { ssr: false }
);

export default function Home() {
  return (
    <div className="flex flex-col items-center px-2 pt-10 bg-gradient-to-r from-purple-500 to-blue-800 min-h-screen text-white">
      <Head>
        <title>Mediapie FaceLandmarker Demo</title>
      </Head>
      <h1 className="text-4xl font-bold mb-4 mt-10 text-shadow">
        Mediapie FaceLandmarker Demo
      </h1>
      <p className="mt-4 mb-8 text-center px-4 text-lg">
        Detect the most prominent face from an input image, then estimate 478 3D
        facial landmarks and 52 facial blendshape scores in real-time.
      </p>
      <FaceLandmarkCanvas />
    </div>
  );
}
