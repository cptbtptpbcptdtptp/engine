import { XRHandle } from "../data/XRHandle";
import { EnumXRInputSource } from "../enum/EnumXRInputSource";
import { XRButtonDec } from "../enum/EnumXRButton";
import { XRFeature } from "../abstract/XRFeature";
import { XRCamera } from "../data/XRCamera";
import { XRPose } from "../data/XRPose";

export class XRInputManager extends XRFeature {
  protected _inputs: (XRHandle | XRCamera)[] = [];

  getHandle(source: EnumXRInputSource): XRHandle {
    return this._inputs[source] as XRHandle;
  }

  getCamera(source: EnumXRInputSource): XRCamera {
    return this._inputs[source] as XRCamera;
  }

  getPose(source: EnumXRInputSource): XRPose {
    return this._inputs[source].pose;
  }

  isButtonDown(source: EnumXRInputSource, button: XRButtonDec): boolean {
    const handle = this._inputs[source] as XRHandle;
    return !!(handle?._downMap[button] === this._engine.time.frameCount);
  }

  isButtonUp(source: EnumXRInputSource, button: XRButtonDec): boolean {
    const handle = this._inputs[source] as XRHandle;
    return !!(handle[source]?._upMap[button] === this._engine.time.frameCount);
  }

  isButtonHeldDown(source: EnumXRInputSource, button: XRButtonDec): boolean {
    const handle = this._inputs[source] as XRHandle;
    return !!(handle[source]?.pressedButtons & button);
  }
}
