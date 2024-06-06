import { Vector4 } from "@galacean/engine-math";
import { Engine } from "../../Engine";
import { MeshTopology, Primitive, SubMesh, VertexElement, VertexElementFormat } from "../../graphic";
import { VertexAttribute } from "../../mesh";
import { Texture2D } from "../../texture";
import { IPoolElement } from "../../utils/Pool";

/**
 * @internal
 */
export class CharRenderInfo implements IPoolElement {
  texture: Texture2D;
  /** x:Top y:Left z:Bottom w:Right */
  localPositions: Vector4 = new Vector4();
  primitive: Primitive;
  subPrimitive: SubMesh;

  init(engine: Engine) {
    if (!this.primitive) {
      const primitive = (this.primitive = new Primitive(engine));
      primitive.addVertexElement(new VertexElement(VertexAttribute.Position, 0, VertexElementFormat.Vector3, 0));
      primitive.addVertexElement(new VertexElement(VertexAttribute.UV, 12, VertexElementFormat.Vector2, 0));
      primitive.addVertexElement(new VertexElement(VertexAttribute.Color, 20, VertexElementFormat.Vector4, 0));
      engine._batcher.allocate(primitive, 4, 6);
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
      this.subPrimitive = new SubMesh(indexOffset, 6, MeshTopology.Triangles);
    }
  }

  dispose(): void {
    this.texture = null;
    this.primitive = null;
    this.subPrimitive = null;
  }
}
