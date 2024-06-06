import { BoundingBox, Color, Matrix, Vector2 } from "@galacean/engine-math";
import { StaticInterfaceImplement } from "../../base/StaticInterfaceImplement";
import { Primitive, SubMesh } from "../../graphic";
import { Sprite } from "../sprite";
import { IAssembler } from "./IAssembler";

/**
 * @internal
 */
@StaticInterfaceImplement<IAssembler>()
export class SlicedSpriteAssembler {
  static _rectangleTriangles: number[] = [
    0, 1, 4, 1, 5, 4, 1, 2, 5, 2, 6, 5, 2, 3, 6, 3, 7, 6, 4, 5, 8, 5, 9, 8, 5, 6, 9, 6, 10, 9, 6, 7, 10, 7, 11, 10, 8,
    9, 12, 9, 13, 12, 9, 10, 13, 10, 14, 13, 10, 11, 14, 11, 15, 14
  ];
  static _worldMatrix: Matrix = new Matrix();

  static resetData(primitive: Primitive, subPrimitive: SubMesh): void {
    primitive.engine._batcher.allocate(primitive, 16, 54);
    const { vertexBufferBindings, indexBufferBinding } = primitive;
    const vertexOffset = vertexBufferBindings[0]._offset / 36;
    const indexArr = new Uint16Array(indexBufferBinding._buffer.data.buffer);
    let indexOffset = indexBufferBinding._offset / 2;
    const { _rectangleTriangles: triangles } = this;
    for (let i = 0, n = triangles.length; i < n; i++) {
      indexArr[indexOffset + i] = triangles[i] + vertexOffset;
    }
    subPrimitive.start = indexOffset;
    subPrimitive.count = 54;
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
