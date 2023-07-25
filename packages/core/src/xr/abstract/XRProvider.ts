import { EnumXRMode } from "../enum/EnumXRMode";
import { IXRDescriptor } from "../interface/IXRDescriptor";
import { EnumXRFeature } from "../enum/EnumXRFeature";
import { XRFeature } from "./XRFeature";
import { IXRFeatureDescriptor } from "../interface/IXRFeatureDescriptor";

export abstract class XRProvider {
  name: string = "Web-XR";

  isSupportedMode(mode: EnumXRMode): Promise<void> {
    return new Promise((resolve, reject) => {
      reject();
    });
  }

  isSupportedFeature(feature: EnumXRFeature): Promise<void> {
    return new Promise((resolve, reject) => {
      reject();
    });
  }

  createFeature(descriptor: IXRFeatureDescriptor): Promise<XRFeature> {
    return new Promise((resolve) => {
      resolve(null);
    });
  }

  request(descriptor: IXRDescriptor): Promise<void> {
    return new Promise((resolve, reject) => {
      reject();
    });
  }

  onStart(): Promise<void> {
    return new Promise((resolve, reject) => {
      reject();
    });
  }

  onUpdate(): void {}

  onLateUpdate(): void {}

  onDestroy(): void {}

  onResume(): void {}

  onPause(): void {}
}
