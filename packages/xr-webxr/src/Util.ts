import { XRTrackedInputDevice } from "@galacean/engine-xr";

export function parseXRMode(mode: number): XRSessionMode | null {
  switch (mode) {
    case 1:
      return "immersive-ar";
    case 2:
      return "immersive-vr";
    default:
      return null;
  }
}

export function getInputSource(inputSource: XRInputSource): XRTrackedInputDevice {
  switch (inputSource.targetRayMode) {
    case "gaze":
      return XRTrackedInputDevice.Undefined;
    case "screen":
      return XRTrackedInputDevice.Controller;
    case "tracked-pointer":
      if (inputSource.hand) {
        switch (inputSource.handedness) {
          case "left":
            return XRTrackedInputDevice.LeftHand;
          case "right":
            return XRTrackedInputDevice.RightHand;
          default:
            return XRTrackedInputDevice.Undefined;
        }
      } else {
        switch (inputSource.handedness) {
          case "left":
            return XRTrackedInputDevice.LeftController;
          case "right":
            return XRTrackedInputDevice.RightController;
          default:
            return XRTrackedInputDevice.Undefined;
        }
      }
      break;
    default:
      return XRTrackedInputDevice.Undefined;
  }
}

export function viewToCamera(type: XREye): XRTrackedInputDevice {
  switch (type) {
    case "left":
      return XRTrackedInputDevice.LeftCamera;
    case "right":
      return XRTrackedInputDevice.RightCamera;
    default:
      return XRTrackedInputDevice.Camera;
  }
}
