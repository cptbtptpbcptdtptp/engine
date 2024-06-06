import { GraphicsResource } from "../asset/GraphicsResource";
import { TypedArray } from "../base";
import { Engine } from "../Engine";
import { IPlatformBuffer } from "../renderingHardwareInterface";
import { UpdateFlagManager } from "../UpdateFlagManager";
import { IPoolElement } from "../utils/Pool";
import { BufferBindFlag } from "./enums/BufferBindFlag";
import { BufferUsage } from "./enums/BufferUsage";
import { SetDataOptions } from "./enums/SetDataOptions";

/**
 * Buffer.
 */
export class Buffer extends GraphicsResource {
  /** @internal */
  _dataUpdateManager: UpdateFlagManager = new UpdateFlagManager();

  /** @internal */
  private _freeAreas: Area[] = [];
  private _type: BufferBindFlag;
  private _byteLength: number;
  private _bufferUsage: BufferUsage;
  private _platformBuffer: IPlatformBuffer;
  private _readable: boolean;
  private _data: Uint8Array;

  /**
   * Buffer binding flag.
   */
  get type(): BufferBindFlag {
    return this._type;
  }

  /**
   * Byte length.
   */
  get byteLength(): number {
    return this._byteLength;
  }

  /**
   * Buffer usage.
   */
  get bufferUsage(): BufferUsage {
    return this._bufferUsage;
  }

  /**
   * If buffer is readable.
   */
  get readable(): boolean {
    return this._readable;
  }

  /**
   * Buffer data cache.
   *
   * @remarks
   * Buffer must be readable.
   * If the data you get is modified, must call `setData()` to update buffer to GPU.
   */
  get data(): Uint8Array {
    if (this._readable) {
      return this._data;
    } else {
      throw "Buffer is not readable.";
    }
  }

  /**
   * Create Buffer.
   * @param engine - Engine
   * @param type - Buffer binding flag
   * @param byteLength - Byte length
   * @param bufferUsage - Buffer usage
   * @param readable - If buffer is readable
   */
  constructor(engine: Engine, type: BufferBindFlag, byteLength: number, bufferUsage?: BufferUsage, readable?: boolean);

  /**
   * Create Buffer.
   * @param engine - Engine
   * @param type - Buffer binding flag
   * @param data - Buffer data, if `readable` is true, the`data` property will store a copy of this
   * @param bufferUsage - Buffer usage
   * @param readable - If buffer is readable
   */
  constructor(
    engine: Engine,
    type: BufferBindFlag,
    data: ArrayBuffer | ArrayBufferView,
    bufferUsage?: BufferUsage,
    readable?: boolean
  );

  constructor(
    engine: Engine,
    type: BufferBindFlag,
    byteLengthOrData: number | ArrayBuffer | ArrayBufferView,
    bufferUsage: BufferUsage = BufferUsage.Static,
    readable: boolean = false
  ) {
    super(engine);
    this._engine = engine;
    this._type = type;
    this._bufferUsage = bufferUsage;
    this._readable = readable;

    if (typeof byteLengthOrData === "number") {
      this._byteLength = byteLengthOrData;
      this._platformBuffer = engine._hardwareRenderer.createPlatformBuffer(type, byteLengthOrData, bufferUsage);
      if (readable) {
        this._data = new Uint8Array(byteLengthOrData);
        this._freeAreas = [new Area(0, byteLengthOrData)];
      }
    } else {
      const data = byteLengthOrData;
      const byteLength = data.byteLength;
      this._byteLength = byteLength;
      this._platformBuffer = engine._hardwareRenderer.createPlatformBuffer(type, byteLength, bufferUsage, data);
      if (readable) {
        const buffer =
          data.constructor === ArrayBuffer
            ? data.slice(0)
            : (<ArrayBufferView>data).buffer.slice(
                (<ArrayBufferView>data).byteOffset,
                (<ArrayBufferView>data).byteOffset + byteLength
              );
        this._data = new Uint8Array(buffer);
        this._freeAreas = [];
      }
    }
  }

  /**
   * Bind buffer.
   */
  bind(): void {
    this._platformBuffer.bind();
  }

  /**
   * Set buffer data.
   * @param data - Input buffer data
   */
  setData(data: ArrayBuffer | ArrayBufferView): void;

  /**
   * Set buffer data.
   * @param data - Input buffer data
   * @param bufferByteOffset - buffer byte offset
   */
  setData(data: ArrayBuffer | ArrayBufferView, bufferByteOffset: number): void;

  /**
   * Set buffer data.
   * @param data - Input buffer data
   * @param bufferByteOffset - Buffer byte offset
   * @param dataOffset - Buffer byte offset
   * @param dataLength - Data length
   */
  setData(data: ArrayBuffer | ArrayBufferView, bufferByteOffset: number, dataOffset: number, dataLength?: number): void;

  /**
   * Set buffer data.
   * @param data - Input buffer data
   * @param bufferByteOffset - Buffer byte offset
   * @param dataOffset - Buffer byte offset
   * @param dataLength - Data length
   * @param options - Update strategy: None/Discard/NoOverwrite
   */
  setData(
    data: ArrayBuffer | ArrayBufferView,
    bufferByteOffset: number,
    dataOffset: number,
    dataLength: number,
    options: SetDataOptions
  ): void;

  setData(
    data: ArrayBuffer | ArrayBufferView,
    bufferByteOffset: number = 0,
    dataOffset: number = 0,
    dataLength?: number,
    options: SetDataOptions = SetDataOptions.None
  ): void {
    this._platformBuffer.setData(this._byteLength, data, bufferByteOffset, dataOffset, dataLength, options);

    if (this._readable) {
      const arrayBuffer = data.constructor === ArrayBuffer ? data : (<ArrayBufferView>data).buffer;

      if (this._data.buffer !== arrayBuffer) {
        const byteSize = (<TypedArray>data).BYTES_PER_ELEMENT || 1; // TypeArray is BYTES_PER_ELEMENT, unTypeArray is 1
        const dataByteLength = dataLength ? byteSize * dataLength : data.byteLength;
        const isArrayBufferView = (<ArrayBufferView>data).byteOffset !== undefined;
        const byteOffset = isArrayBufferView ? (<ArrayBufferView>data).byteOffset + dataOffset * byteSize : dataOffset;
        const srcData = new Uint8Array(arrayBuffer, byteOffset, dataByteLength);
        this._data.set(srcData, bufferByteOffset);
      }
    }
    this._isContentLost = false;
    this._dataUpdateManager.dispatch();
  }

  /**
   * Get buffer data.
   * @param data - Output buffer data
   */
  getData(data: ArrayBufferView): void;

  /**
   * Get buffer data.
   * @param data - Output buffer data
   * @param bufferByteOffset - Buffer byte offset
   */
  getData(data: ArrayBufferView, bufferByteOffset: number): void;

  /**
   * Get buffer data.
   * @param data - Output buffer data
   * @param bufferByteOffset - Buffer byte offset
   * @param dataOffset - Output data offset
   * @param dataLength - Output data length
   */
  getData(data: ArrayBufferView, bufferByteOffset: number, dataOffset: number, dataLength: number): void;

  getData(data: ArrayBufferView, bufferByteOffset: number = 0, dataOffset: number = 0, dataLength?: number): void {
    this._platformBuffer.getData(data, bufferByteOffset, dataOffset, dataLength);
  }

  /**
   * Mark buffer as readable, the `data` property will be not accessible anymore.
   */
  markAsUnreadable(): void {
    this._data = null;
    this._readable = false;
  }

  allocate(need: number): number {
    if (!this._readable) {
      throw "Buffer is not readable.";
    }
    const { _freeAreas: freeAreas } = this;
    for (let i = 0, l = freeAreas.length; i < l; ++i) {
      const area = freeAreas[i];
      const len = area.size;
      if (len > need) {
        const offset = area.offset;
        area.offset += need;
        area.size -= need;
        return offset;
      } else if (len === need) {
        freeAreas.splice(i, 1);
        return area.offset;
      }
    }
    return -1;
  }

  free(offset: number, size: number): void {
    if (!this._readable) {
      throw "Buffer is not readable.";
    }
    const { _freeAreas: freeAreas } = this;
    const length = freeAreas.length;
    if (length === 0) {
      freeAreas.push(new Area(offset, size));
      return;
    }

    let notMerge = true;
    let preEnd = offset + size;
    for (let i = 0; i < length; ++i) {
      const area = freeAreas[i];
      const curEnd = area.offset + area.size;
      if (preEnd < area.offset) {
        notMerge && freeAreas.splice(i, 0, new Area(offset, size));
        return;
      } else if (preEnd === area.offset) {
        area.offset = offset;
        size = area.size += size;
        preEnd = curEnd;
        notMerge = false;
      } else if (offset === curEnd) {
        size = area.size += size;
        offset = area.offset;
        notMerge = false;
      } else if (offset > curEnd) {
        i + 1 === length && freeAreas.push(new Area(offset, size));
      }
    }
  }

  override _rebuild(): void {
    const platformBuffer = this._engine._hardwareRenderer.createPlatformBuffer(
      this._type,
      this._byteLength,
      this._bufferUsage
    );
    this._platformBuffer = platformBuffer;
  }

  /**
   * @internal
   */
  protected override _onDestroy() {
    super._onDestroy();
    this._platformBuffer.destroy();
  }
}

/**
 * @internal
 */
class Area implements IPoolElement {
  constructor(
    public offset: number = -1,
    public size: number = 0
  ) {}

  dispose?(): void {}
}
