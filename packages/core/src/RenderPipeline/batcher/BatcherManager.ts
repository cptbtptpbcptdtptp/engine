import { Engine } from "../../Engine";
import { RenderContext } from "../RenderContext";
import { RenderData } from "../RenderData";
import { RenderElement } from "../RenderElement";
import { RenderDataUsage } from "../enums/RenderDataUsage";

export class BatcherManager {
  /** @internal */
  _engine: Engine;

  constructor(engine: Engine) {
    this._engine = engine;
  }

  destroy() {
    this._engine = null;
  }

  commitRenderData(context: RenderContext, data: RenderData): void {
    switch (data.usage) {
      case RenderDataUsage.Mesh:
      case RenderDataUsage.Sprite:
      case RenderDataUsage.Text:
        context.camera._renderPipeline.pushRenderData(context, data);
        break;
      default:
        break;
    }
  }

  batch(elements: Array<RenderElement>, batchedElements: Array<RenderElement>): void {
    for (let i = 0, n = elements.length; i < n; i++) {
      batchedElements[i] = elements[i];
    }
    this._engine._batcher.upload();
  }

  clear() {}
}
