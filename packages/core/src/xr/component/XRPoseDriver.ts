import { Script } from "../../Script";
import { EnumXRFeature } from "../enum/EnumXRFeature";
import { EnumXRInputSource } from "../enum/EnumXRInputSource";
import { XRPoseTrackingType } from "../enum/XRPoseUpdateType";
import { XRInputManager } from "../feature/XRInputManager";

export class XRPoseDriver extends Script {
  source: EnumXRInputSource = EnumXRInputSource.Eye;
  updateType: XRPoseTrackingType = XRPoseTrackingType.RotationAndPosition;

  override onLateUpdate() {
    const { xrManager } = this.engine;
    if (!xrManager) {
      return;
    }
    const input = xrManager.getFeature<XRInputManager>(EnumXRFeature.input);
    if (!input) {
      return;
    }
    const pose = input.getPose[this.source];
    if (pose) {
      switch (this.updateType) {
        case XRPoseTrackingType.RotationOnly:
          this.entity.transform.rotationQuaternion = pose.quaternion;
          break;
        case XRPoseTrackingType.PositionOnly:
          this.entity.transform.position = pose.position;
          break;
        case XRPoseTrackingType.RotationAndPosition:
          this.entity.transform.localMatrix = pose.matrix;
          break;
        default:
          break;
      }
    }
  }
}
