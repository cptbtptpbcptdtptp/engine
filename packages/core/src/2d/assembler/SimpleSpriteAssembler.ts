import { BoundingBox, Color, Matrix, Vector2 } from "@galacean/engine-math";
import { StaticInterfaceImplement } from "../../base/StaticInterfaceImplement";
import { Primitive, SubMesh } from "../../graphic";
import { Sprite } from "../sprite";
import { IAssembler } from "./IAssembler";

/**
 * @internal
 */
@StaticInterfaceImplement<IAssembler>()
export class SimpleSpriteAssembler {
  static _rectangleTriangles: number[] = [0, 1, 2, 2, 1, 3];
  static _worldMatrix: Matrix = new Matrix();

  static resetData(primitive: Primitive, subPrimitive: SubMesh): void {
    primitive.engine._batcher.allocate(primitive, 4, 6);
    const indexBufferBinding = primitive.indexBufferBinding;
    const vertexBufferBinding = primitive.vertexBufferBindings[0];
    const indexArr = new Uint16Array(indexBufferBinding._buffer.data.buffer);
    const vertexOffset = vertexBufferBinding._offset / 36;
    let indexOffset = indexBufferBinding._offset / 2;
    indexArr[indexOffset] = vertexOffset;
    indexArr[indexOffset + 1] = 1 + vertexOffset;
    indexArr[indexOffset + 2] = 2 + vertexOffset;
    indexArr[indexOffset + 3] = 2 + vertexOffset;
    indexArr[indexOffset + 4] = 1 + vertexOffset;
    indexArr[indexOffset + 5] = 3 + vertexOffset;
    subPrimitive.start = indexOffset;
    subPrimitive.count = 6;
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
  ): void {
    const { x: pivotX, y: pivotY } = pivot;
    // Renderer's worldMatrix;
    const { _worldMatrix: worldMatrix } = this;
    const { elements: wE } = worldMatrix;
    // Parent's worldMatrix.
    const { elements: pWE } = matrix;
    const sx = flipX ? -width : width;
    const sy = flipY ? -height : height;
    (wE[0] = pWE[0] * sx), (wE[1] = pWE[1] * sx), (wE[2] = pWE[2] * sx);
    (wE[4] = pWE[4] * sy), (wE[5] = pWE[5] * sy), (wE[6] = pWE[6] * sy);
    (wE[8] = pWE[8]), (wE[9] = pWE[9]), (wE[10] = pWE[10]);
    wE[12] = pWE[12] - pivotX * wE[0] - pivotY * wE[4];
    wE[13] = pWE[13] - pivotX * wE[1] - pivotY * wE[5];
    wE[14] = pWE[14] - pivotX * wE[2] - pivotY * wE[6];

    // ---------------
    //  2 - 3
    //  |   |
    //  0 - 1
    // ---------------
    // Update positions.
    const spritePositions = sprite._getPositions();
    const vertexBufferBinding = primitive.vertexBufferBindings[0];
    const vertices = new Float32Array(vertexBufferBinding._buffer.data.buffer);
    let index = vertexBufferBinding._offset / 4;
    for (let i = 0; i < 4; ++i) {
      const { x, y } = spritePositions[i];
      vertices[index] = wE[0] * x + wE[4] * y + wE[12];
      vertices[index + 1] = wE[1] * x + wE[5] * y + wE[13];
      vertices[index + 2] = wE[2] * x + wE[6] * y + wE[14];
      index += 9;
    }
    BoundingBox.transform(sprite._getBounds(), worldMatrix, bounds);
  }

  static updateUVs(sprite: Sprite, primitive: Primitive) {
    const spriteUVs = sprite._getUVs();
    const { x: left, y: bottom } = spriteUVs[0];
    const { x: right, y: top } = spriteUVs[3];
    const vertexBufferBinding = primitive.vertexBufferBindings[0];
    const vertices = new Float32Array(vertexBufferBinding._buffer.data.buffer);
    let index = vertexBufferBinding._offset / 4 + 3;
    vertices[index] = left;
    vertices[index + 1] = bottom;
    index += 9;
    vertices[index] = right;
    vertices[index + 1] = bottom;
    index += 9;
    vertices[index] = left;
    vertices[index + 1] = top;
    index += 9;
    vertices[index] = right;
    vertices[index + 1] = top;
  }

  static updateColor(primitive: Primitive, color: Color): void {
    const { r, g, b, a } = color;
    const vertexBufferBinding = primitive.vertexBufferBindings[0];
    const vertices = new Float32Array(vertexBufferBinding._buffer.data.buffer);
    let index = vertexBufferBinding._offset / 4 + 5;
    for (let i = 0; i < 4; ++i) {
      vertices[index] = r;
      vertices[index + 1] = g;
      vertices[index + 2] = b;
      vertices[index + 3] = a;
      index += 9;
    }
  }
}
