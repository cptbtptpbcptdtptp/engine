import { IndexFormat } from "./enums/IndexFormat";
import { Buffer } from "./Buffer";

/**
 * Index buffer binding.
 */
export class IndexBufferBinding {
  /** @internal */
  _buffer: Buffer;
  /** @internal */
  _format: IndexFormat;
  /** @internal */
  _offset: number;
  /** @internal */
  _size: number;

  /**
   * Index buffer.
   */
  get buffer(): Buffer {
    return this._buffer;
  }

  /**
   * Index buffer format.
   */
  get format(): IndexFormat {
    return this._format;
  }

  /**
   * Create index buffer binding.
   * @param buffer - Index buffer
   * @param format - Index buffer format
   */
  constructor(buffer: Buffer, format: IndexFormat, offset: number = 0, size: number = 0) {
    this._buffer = buffer;
    this._format = format;
    this._offset = offset;
    this._size = size;
  }
}
