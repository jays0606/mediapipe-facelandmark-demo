import {
  FaceLandmarker,
  FilesetResolver,
  FaceLandmarkerResult,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

class FaceLandmarkManager {
  private static instance: FaceLandmarkManager = new FaceLandmarkManager();
  private results!: FaceLandmarkerResult;
  faceLandmarker!: FaceLandmarker;

  private constructor() {
    this.initializeModel();
  }

  static getInstance(): FaceLandmarkManager {
    return FaceLandmarkManager.instance;
  }

  private initializeModel = async () => {
    if (this.faceLandmarker) return;

    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    this.faceLandmarker = await FaceLandmarker.createFromOptions(
      filesetResolver,
      {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU",
        },
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: true,
        runningMode: "VIDEO",
        numFaces: 1,
      }
    );
  };

  getResults = () => {
    return this.results;
  };

  detectLandmarks = (videoElement: HTMLVideoElement, time: number) => {
    if (!this.faceLandmarker) return;

    const results = this.faceLandmarker.detectForVideo(videoElement, time);
    this.results = results;
    return results;
  };

  drawLandmarks = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx || !this.results?.faceLandmarks) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const drawingUtils = new DrawingUtils(ctx);

    const lineWidth = 0.8;
    for (const landmarks of this.results.faceLandmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_TESSELATION,
        { color: "#C0C0C070", lineWidth: lineWidth * 0.5 }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
        { color: "#FF3030", lineWidth: lineWidth }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
        { color: "#FF3030", lineWidth: lineWidth }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
        { color: "#30FF30", lineWidth: lineWidth }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
        { color: "#30FF30", lineWidth: lineWidth }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
        { color: "#E0E0E0", lineWidth: lineWidth * 0.5 }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LIPS,
        { color: "#E0E0E0", lineWidth: lineWidth }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
        { color: "#FF3030", lineWidth: lineWidth }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
        { color: "#30FF30", lineWidth: lineWidth }
      );
    }
  };
}

export default FaceLandmarkManager;
