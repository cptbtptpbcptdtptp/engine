import { SpriteMask } from "../2d";
import { SpriteRenderer } from "../2d/sprite/SpriteRenderer";
import { Camera } from "../Camera";
import { DisorderedArray } from "../DisorderedArray";
import { Engine } from "../Engine";

/**
 * @internal
 */
export class SpriteMaskManager {
  /** @internal */
  _allSpriteMasks: DisorderedArray<SpriteMask> = new DisorderedArray();

  private _preMaskLayer: number = 0;

  constructor(engine: Engine) {}

  addMask(mask: SpriteMask): void {}

  clear(): void {}

  preRender(camera: Camera, renderer: SpriteRenderer): void {}

  postRender(renderer: SpriteRenderer): void {}

  destroy(): void {}

  private _processMasksDiff(camera: Camera, renderer: SpriteRenderer): void {}
}
