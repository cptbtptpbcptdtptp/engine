import { BoundingBox, MathUtil, Rect, Vector2, Vector3, Vector4 } from "@oasis-engine/math";
import { RefObject } from "../../asset/RefObject";
import { BoolUpdateFlag } from "../../BoolUpdateFlag";
import { Engine } from "../../Engine";
import { Texture2D } from "../../texture/Texture2D";
import { UpdateFlagManager } from "../../UpdateFlagManager";
import { CallBackUpdateFlag } from "./SpriteUpdateFlag";

/**
 * 2D sprite.
 */
export class Sprite extends RefObject {
  static _rectangleTriangles: number[] = [0, 2, 1, 2, 0, 3];

  /** The name of sprite. */
  name: string;

  /** @internal */
  _listener: any[];
  /** @internal */
  _triangles: number[];
  /** @internal temp solution. */
  _assetID: number;

  /** Intermediate product data. */
  private _positions: Vector2[] = [new Vector2(), new Vector2(), new Vector2(), new Vector2()];
  private _uv: Vector2[] = [new Vector2(), new Vector2(), new Vector2(), new Vector2()];
  private _bounds: BoundingBox = new BoundingBox();

  /** How to get form texture. */
  private _texture: Texture2D = null;
  private _atlasRotated: boolean = false;
  private _border: Vector4 = new Vector4(0, 0, 0, 0);
  private _atlasRegion: Rect = new Rect(0, 0, 1, 1);
  private _atlasRegionOffset: Vector4 = new Vector4(0, 0, 0, 0);

  /** How to show sprite. */
  private _region: Rect = new Rect(0, 0, 1, 1);
  private _pivot: Vector2 = new Vector2(0.5, 0.5);
  private _pixelsPerUnit: number = 100;

  private _dirtyFlag: SpriteDirtyFlag = SpriteDirtyFlag.all;
  private _updateFlagManager: UpdateFlagManager = new UpdateFlagManager();

  /**
   * The reference to the used texture.
   */
  get texture(): Texture2D {
    return this._texture;
  }

  set texture(value: Texture2D) {
    if (this._texture !== value) {
      this._texture = value;
    }
  }

  /**
   * top left right down
   */
  get border(): Vector4 {
    return this._border;
  }

  set border(border: Vector4) {
    this._border = border;
  }

  /**
   * Pixel per unit.
   */
  get pixelPerUnit(): number {
    return this._pixelsPerUnit;
  }

  set pixelPerUnit(val: number) {
    this._pixelsPerUnit = val;
  }

  /**
   * Is it rotated 90 degrees clockwise when packing.
   */
  get atlasRotated(): boolean {
    return this._atlasRotated;
  }

  set atlasRotated(value: boolean) {
    if (this._atlasRotated != value) {
      this._atlasRotated = value;
      this._setDirtyFlagTrue(SpriteDirtyFlag.all);
    }
  }

  /**
   * The rectangle region of the original texture on its atlas texture, specified in normalized.
   */
  get atlasRegion(): Rect {
    return this._atlasRegion;
  }

  set atlasRegion(value: Rect) {
    const x = MathUtil.clamp(value.x, 0, 1);
    const y = MathUtil.clamp(value.y, 0, 1);
    this._atlasRegion.setValue(x, y, MathUtil.clamp(value.width, 0, 1 - x), MathUtil.clamp(value.height, 0, 1 - y));
    this._setDirtyFlagTrue(SpriteDirtyFlag.all);
  }

  /**
   * The rectangle region offset of the original texture on its atlas texture, specified in normalized.
   */
  get atlasRegionOffset(): Vector4 {
    return this._atlasRegionOffset;
  }

  set atlasRegionOffset(value: Vector4) {
    const x = MathUtil.clamp(value.x, 0, 1);
    const y = MathUtil.clamp(value.y, 0, 1);
    this._atlasRegionOffset.setValue(x, y, MathUtil.clamp(value.z, 0, 1 - x), MathUtil.clamp(value.w, 0, 1 - y));
    this._setDirtyFlagTrue(SpriteDirtyFlag.all);
  }

  /**
   * Location of the sprite's center point in the rectangle region, specified in normalized.
   */
  get pivot(): Vector2 {
    return this._pivot;
  }

  set pivot(value: Vector2) {
    const pivot = this._pivot;
    const { x, y } = value;
    if (pivot === value || pivot.x !== x || pivot.y !== y) {
      pivot.setValue(x, y);
      this._setDirtyFlagTrue(SpriteDirtyFlag.positions);
    }
  }

  /**
   * The rectangle region of the sprite, specified in normalized.
   */
  get region(): Rect {
    return this._region;
  }

  set region(value: Rect) {
    const region = this._region;
    const x = MathUtil.clamp(value.x, 0, 1);
    const y = MathUtil.clamp(value.y, 0, 1);
    region.setValue(x, y, MathUtil.clamp(value.width, 0, 1 - x), MathUtil.clamp(value.height, 0, 1 - y));
    this._setDirtyFlagTrue(SpriteDirtyFlag.all);
  }

  /**
   * Constructor a Sprite.
   * @param engine - Engine to which the sprite belongs
   * @param texture - Texture from which to obtain the Sprite
   * @param region - Rectangle region of the texture to use for the Sprite, specified in normalized
   * @param pivot - Sprite's pivot point relative to its graphic rectangle, specified in normalized
   * @param pixelsPerUnit - The number of pixels in the Sprite that correspond to one unit in world space
   * @param name - The name of Sprite
   */
  constructor(
    engine: Engine,
    texture: Texture2D = null,
    region: Rect = null,
    pivot: Vector2 = null,
    pixelsPerUnit: number = 100,
    name: string = null
  ) {
    super(engine);
    this.name = name;
    this._texture = texture;
    this._pixelsPerUnit = pixelsPerUnit;
    region && region.cloneTo(this._region);
    pivot && pivot.cloneTo(this._pivot);
  }

  /**
   * Clone.
   * @returns Cloned sprite
   */
  clone(): Sprite {
    const cloneSprite = new Sprite(
      this._engine,
      this._texture,
      this._region,
      this._pivot,
      this._pixelsPerUnit,
      this.name
    );
    cloneSprite._assetID = this._assetID;
    cloneSprite._atlasRotated = this._atlasRotated;
    this._atlasRegion.cloneTo(cloneSprite._atlasRegion);
    this._atlasRegionOffset.cloneTo(cloneSprite._atlasRegionOffset);
    return cloneSprite;
  }

  /**
   * @internal
   */
  _registerUpdateFlag(): CallBackUpdateFlag {
    return this._updateFlagManager.createFlag(CallBackUpdateFlag);
  }

  /**
   * @override
   */
  _onDestroy(): void {
    if (this._texture) {
      this._texture = null;
    }
  }

  /*
   * @internal
   */
  get bounds(): BoundingBox {
    if (this._isContainDirtyFlag(SpriteDirtyFlag.bounds) && this._texture) {
      const { positions } = this;
      const { min, max } = this._bounds;
      min.setValue(positions[3].x, positions[3].y, 0);
      max.setValue(positions[1].x, positions[1].y, 0);
      this._setDirtyFlagFalse(SpriteDirtyFlag.bounds);
    }
    return this._bounds;
  }

  /**
   * @internal
   */
  get positions(): Vector2[] {
    if (this._isContainDirtyFlag(SpriteDirtyFlag.positions)) {
      const { _atlasRegion: atlasRegion, _pivot: pivot, _texture: texture } = this;
      const { x: blankLeft, y: blankTop, z: blankRight, w: blankBottom } = this._atlasRegionOffset;
      const { x: regionX, y: regionY, width: regionW, height: regionH } = this._region;
      const regionRight = 1 - regionX - regionW;
      const regionBottom = 1 - regionY - regionH;
      // Real rendering size.
      const realRenderW =
        (texture.width * atlasRegion.width * regionW) / ((1 - blankLeft - blankRight) * this._pixelsPerUnit);
      const realRenderH =
        (texture.height * atlasRegion.height * regionH) / ((1 - blankTop - blankBottom) * this._pixelsPerUnit);
      // Coordinates of the four boundaries.
      const left = (Math.max(blankLeft - regionX, 0) / regionW - pivot.x) * realRenderW;
      const right = (1 - Math.max(blankRight - regionRight, 0) / regionW - pivot.x) * realRenderW;
      const top = (1 - Math.max(blankTop - regionBottom, 0) / regionH - pivot.y) * realRenderH;
      const bottom = (Math.max(blankBottom - regionY, 0) / regionH - pivot.y) * realRenderH;
      // Assign values ​​to _positions
      const positions = this._positions;
      // Top-left.
      positions[0].setValue(left, top);
      // Top-right.
      positions[1].setValue(right, top);
      // Bottom-right.
      positions[2].setValue(right, bottom);
      // Bottom-left.
      positions[3].setValue(left, bottom);
      this._setDirtyFlagFalse(SpriteDirtyFlag.positions);
    }
    return this._positions;
  }

  get uv(): Vector2[] {
    if (this._isContainDirtyFlag(SpriteDirtyFlag.uv)) {
      const { _uv: uv, _atlasRegionOffset: atlasRegionOffset } = this;
      const { x: regionX, y: regionY, width: regionW, height: regionH } = this._region;
      const regionRight = 1 - regionX - regionW;
      const regionBottom = 1 - regionY - regionH;
      const { x: atlasRegionX, y: atlasRegionY, width: atlasRegionW, height: atlasRegionH } = this._atlasRegion;
      const { x: offsetLeft, y: offsetTop, z: offsetRight, w: offsetBottom } = atlasRegionOffset;
      const realWidth = atlasRegionW / (1 - offsetLeft - offsetRight);
      const realHeight = atlasRegionH / (1 - offsetTop - offsetBottom);
      // Coordinates of the four boundaries.
      const left = Math.max(regionX - offsetLeft, 0) * realWidth + atlasRegionX;
      const top = Math.max(regionBottom - offsetTop, 0) * realHeight + atlasRegionY;
      const right = atlasRegionW + atlasRegionX - Math.max(regionRight - offsetRight, 0) * realWidth;
      const bottom = atlasRegionH + atlasRegionY - Math.max(regionY - offsetBottom, 0) * realHeight;
      // Top-left.
      uv[0].setValue(left, top);
      // Top-right.
      uv[1].setValue(right, top);
      // Bottom-right.
      uv[2].setValue(right, bottom);
      // Bottom-left.
      uv[3].setValue(left, bottom);
    }
    return this._uv;
  }

  get slicedUV(): Vector2[] {
    const { _uv: uv } = this;
    const top = 0;
    const left = 0;
    const width = 1;
    const height = 1;
    const { x: borderTop, y: borderLeft, z: borderRight, w: borderBottom } = this._border;
    uv.push(new Vector2(top, left));
    uv.push(new Vector2(top + borderTop * height, left));
    uv.push(new Vector2(top + (1 - borderBottom) * height, left));
    uv.push(new Vector2(top + height, left));

    uv.push(new Vector2(top, left + borderLeft * width));
    uv.push(new Vector2(top + borderTop * height, left + borderLeft * width));
    uv.push(new Vector2(top + (1 - borderBottom) * height, left + borderLeft * width));
    uv.push(new Vector2(top + height, left + borderLeft * width));

    uv.push(new Vector2(top, left + (1 - borderRight) * width));
    uv.push(new Vector2(top + borderTop * height, left + (1 - borderRight) * width));
    uv.push(new Vector2(top + (1 - borderBottom) * height, left + (1 - borderRight) * width));
    uv.push(new Vector2(top + height, left + (1 - borderRight) * width));

    uv.push(new Vector2(top, left + width));
    uv.push(new Vector2(top + borderTop * height, left + width));
    uv.push(new Vector2(top + (1 - borderBottom) * height, left + width));
    uv.push(new Vector2(top + height, left + width));
    return uv;
  }

  private _isContainDirtyFlag(type: number): boolean {
    return (this._dirtyFlag & type) != 0;
  }

  private _setDirtyFlagTrue(type: number): void {
    this._dirtyFlag |= type;
    this._updateFlagManager.dispatch(type);
  }

  private _setDirtyFlagFalse(type: number): void {
    this._dirtyFlag &= ~type;
  }
}

export enum SpriteDirtyFlag {
  texture = 0x1,
  positions = 0x2,
  uv = 0x4,
  slicedUV = 0x8,
  bounds = 0x10,
  all = 0x1f
}
