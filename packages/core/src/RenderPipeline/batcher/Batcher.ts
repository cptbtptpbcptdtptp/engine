import { Engine } from "../../Engine";
import {
  BufferBindFlag,
  BufferUsage,
  IndexBufferBinding,
  IndexFormat,
  Primitive,
  VertexBufferBinding
} from "../../graphic";
import { Buffer } from "../../graphic/Buffer";

export class Batcher {
  /** The maximum number of vertex. */
  static MAX_VERTEX_COUNT: number = 4096;

  private _engine: Engine;
  private _vBuffers: Buffer[] = [];
  private _iBuffers: Buffer[] = [];

  upload(): void {
    const { _vBuffers: vBuffers, _iBuffers: iBuffers } = this;
    for (let i = 0, n = vBuffers.length; i < n; i++) {
      const vBuffer = vBuffers[i];
      vBuffer.setData(vBuffer.data);
    }
    for (let i = 0, n = iBuffers.length; i < n; i++) {
      const iBuffer = iBuffers[i];
      iBuffer.setData(iBuffer.data);
    }
  }

  free(primitive: Primitive): void {
    const { vertexBufferBindings, indexBufferBinding } = primitive;
    indexBufferBinding._buffer.free(indexBufferBinding._offset, indexBufferBinding._size);
    for (let i = 0, n = vertexBufferBindings.length; i < n; i++) {
      const vertexBufferBinding = vertexBufferBindings[i];
      vertexBufferBinding._buffer.free(vertexBufferBinding._offset, vertexBufferBinding._size);
    }
  }

  allocate(primitive: Primitive, vertexCount: number, indexCount: number): void {
    const { _vBuffers: vBuffers, _iBuffers: iBuffers } = this;

    // 顶点数据的（单位是字节）
    const stride = 36;
    const vertexSize = stride * vertexCount;
    const vertexOffset = vBuffers[0].allocate(vertexSize);
    const vertexBufferBinding = new VertexBufferBinding(vBuffers[0], stride, vertexOffset, vertexSize);
    primitive.setVertexBufferBinding(0, vertexBufferBinding);

    // index 数据（单位是字节）
    const indexSize = 2 * indexCount;
    const indexOffset = iBuffers[0].allocate(indexSize);
    const indexBufferBinding = new IndexBufferBinding(iBuffers[0], IndexFormat.UInt16, indexOffset, indexSize);
    primitive.setIndexBufferBinding(indexBufferBinding);
  }

  constructor(engine: Engine) {
    this._engine = engine;
    this._vBuffers.push(
      new Buffer(engine, BufferBindFlag.VertexBuffer, Batcher.MAX_VERTEX_COUNT * 36, BufferUsage.Dynamic, true)
    );
    this._iBuffers.push(
      new Buffer(engine, BufferBindFlag.IndexBuffer, Batcher.MAX_VERTEX_COUNT * 8, BufferUsage.Dynamic, true)
    );
  }
}
