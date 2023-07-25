import { Engine } from "../../Engine";

export abstract class XRFeature {
  protected _engine: Engine;

  isSupported(): boolean {
    return true;
  }

  attach(): boolean {
    return true;
  }

  detach(): boolean {
    return true;
  }

  update(): void {}

  destroy(): void {}

  constructor(engine: Engine) {
    this._engine = engine;
  }
}
