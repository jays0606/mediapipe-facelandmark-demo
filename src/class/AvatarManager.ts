import * as THREE from "three";
import { loadGltf } from "@/utils/loaders";
import { FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import { decomposeMatrix } from "../utils/decomposeMatrix";

class AvatarManager {
  private static instance: AvatarManager = new AvatarManager();
  private scene!: THREE.Scene;
  isModelLoaded = false;

  private constructor() {
    this.scene = new THREE.Scene();
  }

  static getInstance(): AvatarManager {
    return AvatarManager.instance;
  }

  getScene = () => {
    return this.scene;
  };

  loadModel = async (url: string) => {
    if (this.scene.children.length === 1) {
      this.scene.children[0].removeFromParent();
    }
    const gltf = await loadGltf(url);
    gltf.scene.traverse((obj) => (obj.frustumCulled = false));
    this.scene.add(gltf.scene);
    this.isModelLoaded = true;

    console.log(gltf.scene)

    // make hands invisible
    const LeftHand = this.scene.getObjectByName("LeftHand");
    const RightHand = this.scene.getObjectByName("RightHand");
    LeftHand?.scale.set(0, 0, 0);
    RightHand?.scale.set(0, 0, 0);
  };

  updateFacialTransforms = (results: FaceLandmarkerResult, flipped = true) => {
    if (!results || !this.isModelLoaded) return;

    this.updateBlendShapes(results, flipped);
    this.updateTranslation(results, flipped);
  };

  updateBlendShapes = (results: FaceLandmarkerResult, flipped = true) => {
    if (!results.faceBlendshapes) return;

    const blendShapes = results.faceBlendshapes[0]?.categories;
    if (!blendShapes) return;

    this.scene.traverse((obj) => {
      if ("morphTargetDictionary" in obj && "morphTargetInfluences" in obj) {
        const morphTargetDictionary = obj.morphTargetDictionary as {
          [key: string]: number;
        };
        const morphTargetInfluences =
          obj.morphTargetInfluences as Array<number>;

        for (const { score, categoryName } of blendShapes) {
          let updatedCategoryName = categoryName;
          if (flipped && categoryName.includes("Left")) {
            updatedCategoryName = categoryName.replace("Left", "Right");
          } else if (flipped && categoryName.includes("Right")) {
            updatedCategoryName = categoryName.replace("Right", "Left");
          }
          const index = morphTargetDictionary[updatedCategoryName];
          morphTargetInfluences[index] = score;
        }
      }
    });
  };

  updateTranslation = (results: FaceLandmarkerResult, flipped = true) => {
    if (!results.facialTransformationMatrixes) return;

    const matrixes = results.facialTransformationMatrixes[0]?.data;
    if (!matrixes) return;

    const { translation, rotation, scale } = decomposeMatrix(matrixes);
    const euler = new THREE.Euler(rotation.x, rotation.y, rotation.z, "ZYX");
    const quaternion = new THREE.Quaternion().setFromEuler(euler);
    if (flipped) {
      // flip to x axis
      quaternion.y *= -1;
      quaternion.z *= -1;
      translation.x *= -1;
    }

    const Head = this.scene.getObjectByName("Head");    
    Head?.quaternion.slerp(quaternion, 1.0);

    const root = this.scene.getObjectByName("AvatarRoot");
    // values empirically calculated
    root?.position.set(
      translation.x * 0.01,
      translation.y * 0.01,
      (translation.z + 50) * 0.02
    );
  };
}

export default AvatarManager;
