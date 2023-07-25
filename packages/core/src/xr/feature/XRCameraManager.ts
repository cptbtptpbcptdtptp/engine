import { Camera } from "../../Camera";
import { XRFeature } from "../abstract/XRFeature";
import { EnumXRFeature } from "../enum/EnumXRFeature";
import { EnumXRInputSource } from "../enum/EnumXRInputSource";
import { XRInputManager } from "./XRInputManager";

export class XRCameraManager extends XRFeature {
  private _near: number;
  private _far: number;
  private _cameras: Camera[] = [];

  attachCamera(source: EnumXRInputSource, camera: Camera): void {
    this._cameras[source] = camera;
  }

  detachCamera(source: EnumXRInputSource): void {
    this._cameras[source] = null;
  }

  override update(): void {
    const { xrManager } = this._engine;
    const { _cameras: cameras } = this;
    const input = xrManager.getFeature<XRInputManager>(EnumXRFeature.input);
    if (!input) {
      return;
    }
    for (let i = 0, n = cameras.length; i < n; i++) {
      const camera = cameras[i];
      if (camera) {
        const xrCamera = input.getCamera(i);
        camera.viewport = xrCamera.viewport;
        camera.projectionMatrix = xrCamera.project;
        // Todo: reset near and far
      }
    }
  }
}
