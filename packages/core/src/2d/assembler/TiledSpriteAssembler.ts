import { BoundingBox, Color, Matrix, Vector2 } from "@galacean/engine-math";
import { DisorderedArray } from "../../DisorderedArray";
import { StaticInterfaceImplement } from "../../base/StaticInterfaceImplement";
import { Primitive, SubMesh } from "../../graphic";
import { Sprite } from "../sprite";
import { IAssembler } from "./IAssembler";

/**
 * @internal
 */
@StaticInterfaceImplement<IAssembler>()
export class TiledSpriteAssembler {
  static _worldMatrix: Matrix = new Matrix();
  static _posRow: DisorderedArray<number> = new DisorderedArray<number>();
  static _posColumn: DisorderedArray<number> = new DisorderedArray<number>();
  static _uvRow: DisorderedArray<number> = new DisorderedArray<number>();
  static _uvColumn: DisorderedArray<number> = new DisorderedArray<number>();

  static resetData(primitive: Primitive, subPrimitive: SubMesh, vCount: number, iCount: number): void {
    primitive.engine._batcher.allocate(primitive, vCount, iCount);
    subPrimitive.start = primitive.indexBufferBinding._offset / 2;
    subPrimitive.count = iCount;
  }

  static updatePositions(
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
  ): void {}

  static updateUVs(sprite: Sprite, primitive: Primitive) {}

  static updateColor(primitive: Primitive, color: Color): void {}
}

enum TiledType {
  Compressed,
  WithoutTiled,
  WithTiled
}
