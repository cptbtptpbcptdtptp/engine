import { Matrix, Vector4 } from "@galacean/engine-math";
import { XRPose } from "./XRPose";

export class XRCamera {
  pose: XRPose;
  project: Matrix;
  viewport: Vector4;
  // Render pass
  frameBuffer?: WebGLFramebuffer;
  frameWidth?: number;
  frameHeight?: number;
}
