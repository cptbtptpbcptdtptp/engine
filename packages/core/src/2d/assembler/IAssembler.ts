import { BoundingBox, Color, Matrix, Vector2 } from "@galacean/engine-math";
import { Primitive, SubMesh } from "../../graphic";
import { Sprite } from "../sprite";

/**
 * @internal
 */
export interface IAssembler {
  resetData(primitive: Primitive, subPrimitive: SubMesh, vCount?: number, iCount?: number): void;
  updatePositions(
    sprite: Sprite,
    width: number,
    height: number,
    pivot: Vector2,
    matrix: Matrix,
    primitive: Primitive,
    subPrimitive: SubMesh,
    bounds: BoundingBox,
    flipX?: boolean,
    flipY?: boolean
  ): void;
  updateUVs?(sprite: Sprite, primitive: Primitive, subPrimitive: SubMesh): void;
  updateColor?(primitive: Primitive, color: Color): void;
}
