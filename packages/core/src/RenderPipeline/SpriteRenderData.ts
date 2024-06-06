import { Primitive, SubMesh } from "../graphic";
import { Material } from "../material/Material";
import { Renderer } from "../Renderer";
import { Texture2D } from "../texture";
import { IPoolElement } from "../utils/Pool";
import { RenderDataUsage } from "./enums/RenderDataUsage";
import { RenderData } from "./RenderData";

export class SpriteRenderData extends RenderData implements IPoolElement {
  texture: Texture2D;

  constructor() {
    super();
    this.usage = RenderDataUsage.Sprite;
  }

  override set(
    component: Renderer,
    material: Material,
    primitive: Primitive,
    subPrimitive: SubMesh,
    texture?: Texture2D
  ): void {
    super.set(component, material, primitive, subPrimitive);
    this.texture = texture;
  }

  override dispose(): void {
    super.dispose();
    this.texture = null;
  }
}
