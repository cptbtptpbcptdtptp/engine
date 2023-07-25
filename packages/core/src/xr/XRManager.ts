import { Engine } from "../Engine";
import { EnumXRMode } from "./enum/EnumXRMode";
import { XRProvider } from "./abstract/XRProvider";
import { EnumXRFeature } from "./enum/EnumXRFeature";
import { XRFeature } from "./abstract/XRFeature";
import { XRTrackingMode } from "./enum/XRTrackingMode";
import { Logger } from "../base";
import { IXRFeatureDescriptor } from "./interface/IXRFeatureDescriptor";
import { resolve } from "path";

export class XRManager {
  private _engine: Engine;
  private _provider: XRProvider;
  private _features: XRFeature[] = [];
  private _isPaused: boolean = false;

  isSupportedMode(mode: EnumXRMode): Promise<void> {
    return this._provider.isSupportedMode(mode);
  }

  isSupportedFeature(feature: EnumXRFeature): Promise<void> {
    return this._provider.isSupportedFeature(feature);
  }

  addFeature<T extends XRFeature>(feature: EnumXRFeature, descriptor: IXRFeatureDescriptor): Promise<T> | T {
    return new Promise((resolve, reject) => {
      if (!this._provider) {
        reject(new Error("xr 没有实例化"));
        return;
      }
      if (this._features[feature]) {
        Logger.warn("已经存在 feature : " + EnumXRFeature[feature]);
        resolve(this._features[feature] as T);
      } else {
        (this._provider.createFeature(descriptor) as Promise<T>).then((ins: T) => {
          if (ins) {
            this._features[feature] = ins;
            resolve(ins);
          } else {
            reject(new Error("Provider 没有实现这个功能."));
          }
        });
      }
    });
  }

  getFeature<T extends XRFeature>(feature: EnumXRFeature): T {
    return this._features[feature] as T;
  }

  enableFeature(feature: EnumXRFeature): void {
    this._features[feature]?.attach();
  }

  disableFeature(feature: EnumXRFeature): void {
    this._features[feature]?.detach();
  }

  init(
    mode: EnumXRMode,
    trackingMode: XRTrackingMode = XRTrackingMode.Auto,
    features: EnumXRFeature[] = []
  ): Promise<void> {
    return this._provider.request({ mode, trackingMode, features });
  }

  pause(): void {
    if (!this._isPaused) {
      this._provider.onPause();
      this._isPaused = true;
    }
  }

  resume(): void {
    if (this._isPaused) {
      this._provider.onResume();
      this._isPaused = false;
    }
  }

  destroy(): void {
    this._provider.onDestroy();
    this._provider = null;
  }

  /**
   * @internal
   *
   * @param systemTime
   * @param frame
   */
  _update() {
    // Update provider.
    this._provider.onUpdate();
    // Update feature.
    const { _features: features } = this;
    for (let i = 0, n = features.length; i < n; i++) {
      features[i]?.update();
    }
  }

  constructor(engine: Engine, type: new (engine: Engine) => XRProvider) {
    this._engine = engine;
    this._provider = new type(engine);
  }
}
