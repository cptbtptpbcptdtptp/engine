import { Matrix, Quaternion, Vector3 } from "@galacean/engine-math";

export class XRPose {
  matrix: Matrix = new Matrix();
  position: Vector3 = new Vector3();
  quaternion: Quaternion = new Quaternion();
}
