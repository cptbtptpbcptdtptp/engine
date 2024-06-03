import { Color, MathUtil } from "@galacean/engine-math";
import { Sprite, SpriteDrawMode, SpriteRenderer, SpriteTileMode } from "../2d";
import { UIRenderer } from "./UIRenderer";
import { assignmentClone, deepClone, ignoreClone } from "../clone/CloneManager";
import { ShaderProperty } from "../shader";
import { IAssembler } from "../2d/assembler/IAssembler";
import { Entity } from "../Entity";
import { SimpleSpriteAssembler } from "../2d/assembler/SimpleSpriteAssembler";
import { SlicedSpriteAssembler } from "../2d/assembler/SlicedSpriteAssembler";
import { TiledSpriteAssembler } from "../2d/assembler/TiledSpriteAssembler";
import { SpriteModifyFlags } from "../2d/enums/SpriteModifyFlags";
import { RendererUpdateFlags } from "../Renderer";
import { RenderContext } from "../RenderPipeline/RenderContext";

export class Image extends UIRenderer {
  /** @internal */
  static _textureProperty: ShaderProperty = ShaderProperty.getByName("renderer_SpriteTexture");
  @deepClone
  private _color: Color = new Color(1, 1, 1, 1);
  @ignoreClone
  private _sprite: Sprite = null;
  @ignoreClone
  private _drawMode: SpriteDrawMode;
  @assignmentClone
  private _assembler: IAssembler;
  @assignmentClone
  private _tileMode: SpriteTileMode = SpriteTileMode.Continuous;
  @assignmentClone
  private _tiledAdaptiveThreshold: number = 0.5;

  /**
   * The draw mode of the sprite renderer.
   */
  get drawMode(): SpriteDrawMode {
    return this._drawMode;
  }

  set drawMode(value: SpriteDrawMode) {
    if (this._drawMode !== value) {
      this._drawMode = value;
      switch (value) {
        case SpriteDrawMode.Simple:
          this._assembler = SimpleSpriteAssembler;
          break;
        case SpriteDrawMode.Sliced:
          this._assembler = SlicedSpriteAssembler;
          break;
        case SpriteDrawMode.Tiled:
          this._assembler = TiledSpriteAssembler;
          break;
        default:
          break;
      }
      this._assembler.resetData(this);
      this._dirtyUpdateFlag |= ImageUpdateFlags.VertexData;
    }
  }

  /**
   * The tiling mode of the sprite renderer. (Only works in tiled mode.)
   */
  get tileMode(): SpriteTileMode {
    return this._tileMode;
  }

  set tileMode(value: SpriteTileMode) {
    if (this._tileMode !== value) {
      this._tileMode = value;
      if (this.drawMode === SpriteDrawMode.Tiled) {
        this._dirtyUpdateFlag |= ImageUpdateFlags.VertexData;
      }
    }
  }

  /**
   * Stretch Threshold in Tile Adaptive Mode, specified in normalized. (Only works in tiled adaptive mode.)
   */
  get tiledAdaptiveThreshold(): number {
    return this._tiledAdaptiveThreshold;
  }

  set tiledAdaptiveThreshold(value: number) {
    if (value !== this._tiledAdaptiveThreshold) {
      value = MathUtil.clamp(value, 0, 1);
      this._tiledAdaptiveThreshold = value;
      if (this.drawMode === SpriteDrawMode.Tiled) {
        this._dirtyUpdateFlag |= ImageUpdateFlags.VertexData;
      }
    }
  }

  /**
   * The Sprite to render.
   */
  get sprite(): Sprite {
    return this._sprite;
  }

  set sprite(value: Sprite | null) {
    const lastSprite = this._sprite;
    if (lastSprite !== value) {
      if (lastSprite) {
        this._addResourceReferCount(lastSprite, -1);
        lastSprite._updateFlagManager.removeListener(this._onSpriteChange);
      }
      this._dirtyUpdateFlag |= ImageUpdateFlags.All;
      if (value) {
        this._addResourceReferCount(value, 1);
        value._updateFlagManager.addListener(this._onSpriteChange);
        this.shaderData.setTexture(SpriteRenderer._textureProperty, value.texture);
      } else {
        this.shaderData.setTexture(SpriteRenderer._textureProperty, null);
      }
      this._sprite = value;
    }
  }

  /**
   * @internal
   */
  constructor(entity: Entity) {
    super(entity);
    this.drawMode = SpriteDrawMode.Simple;
    this._dirtyUpdateFlag |= ImageUpdateFlags.Color;
    this.setMaterial(this._engine._spriteDefaultMaterial);
    this._onSpriteChange = this._onSpriteChange.bind(this);
  }

  /**
   * @internal
   */
  protected override _render(context: RenderContext): void {
    const { x: width, y: height } = this._uiTransform.rect;
    if (!this.sprite?.texture || !width || !height) {
      return;
    }

    let material = this.getMaterial();
    if (!material) {
      return;
    }
    // @todo: This question needs to be raised rather than hidden.
    if (material.destroyed) {
      material = this._engine._uiDefaultMaterial;
    }

    // Update position
    if (this._dirtyUpdateFlag & RendererUpdateFlags.WorldVolume) {
      this._assembler.updatePositions(this);
      this._dirtyUpdateFlag &= ~RendererUpdateFlags.WorldVolume;
    }

    // Update uv
    if (this._dirtyUpdateFlag & ImageUpdateFlags.UV) {
      this._assembler.updateUVs(this);
      this._dirtyUpdateFlag &= ~ImageUpdateFlags.UV;
    }

    // Update color
    if (this._dirtyUpdateFlag & ImageUpdateFlags.Color) {
      this._assembler.updateColor(this);
      this._dirtyUpdateFlag &= ~ImageUpdateFlags.Color;
    }

    // Push primitive
    const { engine } = context.camera;
    const renderData = engine._spriteRenderDataPool.getFromPool();
    const { _chunk: chunk } = this;
    renderData.set(this, material, chunk._meshBuffer._mesh._primitive, chunk._subMesh, this.sprite.texture, chunk);
    renderData.usage = RenderDataUsage.Sprite;
    engine._batcherManager.commitRenderData(context, renderData);
  }

  @ignoreClone
  private _onSpriteChange(type: SpriteModifyFlags): void {
    switch (type) {
      case SpriteModifyFlags.texture:
        this.shaderData.setTexture(SpriteRenderer._textureProperty, this.sprite.texture);
        break;
      case SpriteModifyFlags.size:
        const { _drawMode: drawMode } = this;
        switch (drawMode) {
          case SpriteDrawMode.Sliced:
            this._dirtyUpdateFlag |= ImageUpdateFlags.Position;
            break;
          case SpriteDrawMode.Tiled:
            this._dirtyUpdateFlag |= ImageUpdateFlags.VertexData;
            break;
          default:
            break;
        }
        break;
      case SpriteModifyFlags.border:
        this._drawMode === SpriteDrawMode.Sliced && (this._dirtyUpdateFlag |= ImageUpdateFlags.VertexData);
        break;
      case SpriteModifyFlags.region:
      case SpriteModifyFlags.atlasRegionOffset:
        this._dirtyUpdateFlag |= ImageUpdateFlags.PositionAndUV;
        break;
      case SpriteModifyFlags.atlasRegion:
        this._dirtyUpdateFlag |= ImageUpdateFlags.UV;
        break;
      case SpriteModifyFlags.pivot:
        this._dirtyUpdateFlag |= RendererUpdateFlags.WorldVolume;
        break;
      case SpriteModifyFlags.destroy:
        this.sprite = null;
        break;
    }
  }
}

/**
 * @remarks Extends `RendererUpdateFlag`.
 */
enum ImageUpdateFlags {
  /** Position. */
  Position = 0x1,
  /** UV. */
  UV = 0x2,
  /** Position and UV. */
  PositionAndUV = 0x3,
  /** Color. */
  Color = 0x4,
  /** Vertex data. */
  VertexData = 0x7,
  /** All. */
  All = 0x7
}
