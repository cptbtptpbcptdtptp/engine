import { ShaderPass } from "../shader/ShaderPass";
import { IPoolElement } from "../utils/Pool";
import { RenderData } from "./RenderData";

export class UIRenderElement implements IPoolElement {
  data: RenderData;
  shaderPasses: ReadonlyArray<ShaderPass>;

  set(data: RenderData, shaderPasses: ReadonlyArray<ShaderPass>): void {
    this.data = data;
    this.shaderPasses = shaderPasses;
  }

  dispose(): void {
    this.data = this.shaderPasses = null;
  }
}
