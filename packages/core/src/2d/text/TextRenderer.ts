<<<<<<< HEAD
import { BoundingBox, Color, Vector3 } from "@oasis-engine/math";
import { Sprite, SpriteMaskInteraction, SpriteMaskLayer, SpriteRenderer } from "..";
import { CompareFunction, Renderer, UpdateFlag } from "../..";
import { Camera } from "../../Camera";
import { assignmentClone, deepClone, ignoreClone } from "../../clone/CloneManager";
import { Entity } from "../../Entity";
import { Texture2D } from "../../texture";
import { FontStyle } from "../enums/FontStyle";
import { TextHorizontalAlignment, TextVerticalAlignment } from "../enums/TextAlignment";
import { OverflowMode } from "../enums/TextOverflow";
import { Font } from "./Font";
import { TextUtils } from "./TextUtils";

/**
 * Renders a text for 2D graphics.
 */
export class TextRenderer extends Renderer {
  private static _tempVec3: Vector3 = new Vector3();

  /** @internal temp solution. */
  @ignoreClone
  _customLocalBounds: BoundingBox = null;
  /** @internal temp solution. */
  @ignoreClone
  _customRootEntity: Entity = null;

  @ignoreClone
  private _sprite: Sprite = null;
  @deepClone
  private _positions: Vector3[] = [new Vector3(), new Vector3(), new Vector3(), new Vector3()];
  @deepClone
  private _color: Color = new Color(1, 1, 1, 1);
=======
import { BoundingBox } from "@oasis-engine/math";
import { Camera } from "../../Camera";
import { assignmentClone, ignoreClone } from "../../clone/CloneManager";
import { Entity } from "../../Entity";
import { Texture2D } from "../../texture";
import { TextHorizontalAlignment, TextVerticalAlignment } from "../enums/TextAlignment";
import { TextHorizontalOverflow, TextVerticalOverflow } from "../enums/TextOverflow";
import { Sprite, SpriteRenderer } from "../sprite";
import { TextUtils } from "./TextUtils";

export class TextRenderer extends SpriteRenderer {
  static needPremultiplyAlpha: boolean = false;

>>>>>>> fc710ceab08bbcd405260b1e2a781593c4708e13
  @assignmentClone
  private _text: string = "";
  @assignmentClone
  private _width: number = 0;
  @assignmentClone
  private _height: number = 0;
  @assignmentClone
<<<<<<< HEAD
  private _font: Font = null;
  @assignmentClone
  private _fontSize: number = 24;
  @assignmentClone
  private _fontStyle: FontStyle = FontStyle.None;
  @assignmentClone
  private _lineSpacing: number = 0;
=======
  private _fontName: string = "Arial";
  @assignmentClone
  private _fontSize: number = 24;
  @assignmentClone
  private _lineHeight: number = 1;
  @assignmentClone
  private _isBold: boolean = false;
  @assignmentClone
  private _isItalic: boolean = false;
>>>>>>> fc710ceab08bbcd405260b1e2a781593c4708e13
  @assignmentClone
  private _horizontalAlignment: TextHorizontalAlignment = TextHorizontalAlignment.Center;
  @assignmentClone
  private _verticalAlignment: TextVerticalAlignment = TextVerticalAlignment.Center;
  @assignmentClone
<<<<<<< HEAD
  private _enableWrapping: boolean = false;
  @assignmentClone
  private _overflowMode: OverflowMode = OverflowMode.Overflow;
  @ignoreClone
  private _dirtyFlag: number = DirtyFlag.Property;
  @ignoreClone
  private _isWorldMatrixDirty: UpdateFlag;
  @assignmentClone
  private _maskInteraction: SpriteMaskInteraction = SpriteMaskInteraction.None;
  @assignmentClone
  private _maskLayer: number = SpriteMaskLayer.Layer0;

  /**
   * Rendering color for the Text.
   */
  get color(): Color {
    return this._color;
  }

  set color(value: Color) {
    if (this._color !== value) {
      value.cloneTo(this._color);
    }
  }

  /**
   * Rendering string for the Text.
=======
  private _horizontalOverflow: TextHorizontalOverflow = TextHorizontalOverflow.Wrap;
  @assignmentClone
  private _verticalOverflow: TextVerticalOverflow = TextVerticalOverflow.Truncate;
  @ignoreClone
  private _styleDirtyFlag: boolean = true;

  /**
   *
>>>>>>> fc710ceab08bbcd405260b1e2a781593c4708e13
   */
  get text(): string {
    return this._text;
  }

  set text(value: string) {
    value = value || "";
    if (this._text !== value) {
      this._text = value;
<<<<<<< HEAD
      this._setDirtyFlagTrue(DirtyFlag.Property);
    }
  }

  /**
   * The width of the TextRenderer (in 3D world coordinates).
   */
=======
      this._styleDirtyFlag = true;
    }
  }

>>>>>>> fc710ceab08bbcd405260b1e2a781593c4708e13
  get width(): number {
    return this._width;
  }

  set width(value: number) {
    if (this._width !== value) {
      this._width = value;
<<<<<<< HEAD
      this._setDirtyFlagTrue(DirtyFlag.Property);
    }
  }

  /**
   * The height of the TextRenderer (in 3D world coordinates).
   */
=======
      this._styleDirtyFlag = true;
    }
  }

>>>>>>> fc710ceab08bbcd405260b1e2a781593c4708e13
  get height(): number {
    return this._height;
  }

  set height(value: number) {
    if (this._height !== value) {
      this._height = value;
<<<<<<< HEAD
      this._setDirtyFlagTrue(DirtyFlag.Property);
    }
  }

  /**
   * The font of the Text.
   */
  get font(): Font {
    return this._font;
  }

  set font(value: Font) {
    if (this._font !== value) {
      this._font = value;
      this._setDirtyFlagTrue(DirtyFlag.Property);
    }
  }

  /**
   * The font size of the Text.
   */
=======
      this._styleDirtyFlag = true;
    }
  }

  get fontName(): string {
    return this._fontName;
  }

  set fontName(value: string) {
    value = value || "Arial";
    if (this._fontName !== value) {
      this._fontName = value;
      this._styleDirtyFlag = true;
    }
  }

>>>>>>> fc710ceab08bbcd405260b1e2a781593c4708e13
  get fontSize(): number {
    return this._fontSize;
  }

  set fontSize(value: number) {
    if (this._fontSize !== value) {
      this._fontSize = value;
<<<<<<< HEAD
      this._setDirtyFlagTrue(DirtyFlag.Property);
    }
  }

  /**
   * The style of the font.
   */
  get fontStyle(): FontStyle {
    return this._fontStyle;
  }

  set fontStyle(value: FontStyle) {
    if (this.fontStyle !== value) {
      this._fontStyle = value;
      this._setDirtyFlagTrue(DirtyFlag.Property);
    }
  }

  /**
   * The space between two lines (in pixels).
   */
  get lineSpacing(): number {
    return this._lineSpacing;
  }

  set lineSpacing(value: number) {
    if (this._lineSpacing !== value) {
      this._lineSpacing = value;
      this._setDirtyFlagTrue(DirtyFlag.Property);
    }
  }

  /**
   * The horizontal alignment.
   */
=======
      this._styleDirtyFlag = true;
    }
  }

  get lineHeight(): number {
    return this._lineHeight;
  }

  set lineHeight(value: number) {
    if (this._lineHeight !== value) {
      this._lineHeight = value;
      this._styleDirtyFlag = true;
    }
  }

  get isBold(): boolean {
    return this._isBold;
  }

  set isBold(value: boolean) {
    if (this._isBold !== value) {
      this._isBold = value;
      this._styleDirtyFlag = true;
    }
  }

  get isItalic(): boolean {
    return this._isItalic;
  }

  set isItalic(value: boolean) {
    if (this._isItalic !== value) {
      this._isItalic = value;
      this._styleDirtyFlag = true;
    }
  }

>>>>>>> fc710ceab08bbcd405260b1e2a781593c4708e13
  get horizontalAlignment(): TextHorizontalAlignment {
    return this._horizontalAlignment;
  }

  set horizontalAlignment(value: TextHorizontalAlignment) {
    if (this._horizontalAlignment !== value) {
      this._horizontalAlignment = value;
<<<<<<< HEAD
      this._setDirtyFlagTrue(DirtyFlag.Property);
    }
  }

  /**
   * The vertical alignment.
   */
=======
      this._styleDirtyFlag = true;
    }
  }

>>>>>>> fc710ceab08bbcd405260b1e2a781593c4708e13
  get verticalAlignment(): TextVerticalAlignment {
    return this._verticalAlignment;
  }

  set verticalAlignment(value: TextVerticalAlignment) {
    if (this._verticalAlignment !== value) {
      this._verticalAlignment = value;
<<<<<<< HEAD
      this._setDirtyFlagTrue(DirtyFlag.Property);
    }
  }

  /**
   * Whether wrap text to next line when exceeds the width of the container.
   */
  get enableWrapping(): boolean {
    return this._enableWrapping;
  }

  set enableWrapping(value: boolean) {
    if (this._enableWrapping !== value) {
      this._enableWrapping = value;
      this._setDirtyFlagTrue(DirtyFlag.Property);
    }
  }

  /**
   * The overflow mode.
   */
  get overflowMode(): OverflowMode {
    return this._overflowMode;
  }

  set overflowMode(value: OverflowMode) {
    if (this._overflowMode !== value) {
      this._overflowMode = value;
      this._setDirtyFlagTrue(DirtyFlag.Property);
    }
  }

  /**
   * Interacts with the masks.
   */
  get maskInteraction(): SpriteMaskInteraction {
    return this._maskInteraction;
  }

  set maskInteraction(value: SpriteMaskInteraction) {
    if (this._maskInteraction !== value) {
      this._maskInteraction = value;
      this._setDirtyFlagTrue(DirtyFlag.MaskInteraction);
    }
  }

  /**
   * The mask layer the sprite renderer belongs to.
   */
  get maskLayer(): number {
    return this._maskLayer;
  }

  set maskLayer(value: number) {
    this._maskLayer = value;
  }

  constructor(entity: Entity) {
    super(entity);
    const { engine } = this;
    this._isWorldMatrixDirty = entity.transform.registerWorldChangeFlag();
    this._sprite = new Sprite(engine);
    this.font = Font.createFromOS(engine);
    this.setMaterial(engine._spriteDefaultMaterial);
=======
      this._styleDirtyFlag = true;
    }
  }

  get horizontalOverflow(): TextHorizontalOverflow {
    return this._horizontalOverflow;
  }

  set horizontalOverflow(value: TextHorizontalOverflow) {
    if (this._horizontalOverflow !== value) {
      this._horizontalOverflow = value;
      this._styleDirtyFlag = true;
    }
  }

  get verticalOverflow(): TextVerticalOverflow {
    return this._verticalOverflow;
  }

  set verticalOverflow(value: TextVerticalOverflow) {
    if (this._verticalOverflow !== value) {
      this._verticalOverflow = value;
      this._styleDirtyFlag = true;
    }
  }

  constructor(entity: Entity) {
    super(entity);

    // const canvas = this._canvas = document.createElement("canvas");
    // this._context = canvas.getContext("2d");
    // canvas.width = canvas.height = 1;

    this.sprite = new Sprite(this.engine);
>>>>>>> fc710ceab08bbcd405260b1e2a781593c4708e13
  }

  /**
   * @internal
   */
  _render(camera: Camera): void {
<<<<<<< HEAD
    if (
      this._text === "" ||
      (this.enableWrapping && this.width <= 0) ||
      (this.overflowMode === OverflowMode.Truncate && this.height <= 0)
    ) {
      this._clearTexture();
      return;
    }

    const { _sprite: sprite } = this;
    const isTextureDirty = this._isContainDirtyFlag(DirtyFlag.Property);
    if (isTextureDirty) {
      this._updateText();
      this._setDirtyFlagFalse(DirtyFlag.Property);
    }

    if (this._isWorldMatrixDirty.flag || isTextureDirty) {
      this._updatePosition();
      this._isWorldMatrixDirty.flag = false;
    }

    if (this._isContainDirtyFlag(DirtyFlag.MaskInteraction)) {
      this._updateStencilState();
      this._setDirtyFlagFalse(DirtyFlag.MaskInteraction);
    }

    this.shaderData.setTexture(SpriteRenderer._textureProperty, sprite.texture);
    const spriteElementPool = this._engine._spriteElementPool;
    const spriteElement = spriteElementPool.getFromPool();
    spriteElement.setValue(
      this,
      this._positions,
      sprite._uv,
      sprite._triangles,
      this.color,
      this.getMaterial(),
      camera
    );
    camera._renderPipeline.pushPrimitive(spriteElement);
  }

  /**
   * @internal
   */
  _onDestroy(): void {
    this.engine._dynamicTextAtlasManager.removeSprite(this._sprite);
    this._isWorldMatrixDirty.destroy();
    super._onDestroy();
  }

  /**
   * @internal
   */
  _cloneTo(target: TextRenderer): void {
    target.font = this._font;
=======
    if (this._text === '') {
      this.sprite.texture = null;
      return ;
    }

    if (this._styleDirtyFlag) {
      this._updateText();
      this._styleDirtyFlag = false;
    }

    if (TextRenderer.needPremultiplyAlpha) {
      this.shaderData.enableMacro("NEED_PREMULTIPLY_ALPHA");
    } else {
      this.shaderData.disableMacro("NEED_PREMULTIPLY_ALPHA");
    }

    super._render(camera);
>>>>>>> fc710ceab08bbcd405260b1e2a781593c4708e13
  }

  /**
   * @override
   */
  protected _updateBounds(worldBounds: BoundingBox): void {
<<<<<<< HEAD
    const sprite = this._sprite;
    if (sprite && sprite.texture) {
=======
    const sprite = this.sprite;
    if (sprite) {
>>>>>>> fc710ceab08bbcd405260b1e2a781593c4708e13
      if (this._customLocalBounds && this._customRootEntity) {
        const worldMatrix = this._customRootEntity.transform.worldMatrix;
        BoundingBox.transform(this._customLocalBounds, worldMatrix, worldBounds);
      } else {
        const localBounds = sprite.bounds;
        const worldMatrix = this._entity.transform.worldMatrix;
        BoundingBox.transform(localBounds, worldMatrix, worldBounds);
      }
    } else {
      worldBounds.min.setValue(0, 0, 0);
      worldBounds.max.setValue(0, 0, 0);
    }
  }

<<<<<<< HEAD
  private _isContainDirtyFlag(type: number): boolean {
    return (this._dirtyFlag & type) != 0;
  }

  private _setDirtyFlagTrue(type: number): void {
    this._dirtyFlag |= type;
  }

  private _setDirtyFlagFalse(type: number): void {
    this._dirtyFlag &= ~type;
  }

  private _updateText(): void {
    const { width: originWidth, height: originHeight, enableWrapping, overflowMode } = this;
    const fontStr = TextUtils.getNativeFontString(this._font.name, this._fontSize, this._fontStyle);
    const textMetrics = TextUtils.measureText(
      this.text,
      originWidth,
      originHeight,
      this.lineSpacing,
      enableWrapping,
      overflowMode,
      fontStr
    );
    TextUtils.updateText(textMetrics, fontStr, this.horizontalAlignment, this.verticalAlignment);
    this._updateTexture();
  }

  private _updateTexture(): void {
    const trimData = TextUtils.trimCanvas();
    const { width, height } = trimData;
    const canvas = TextUtils.updateCanvas(width, height, trimData.data);
    this._clearTexture();
    const { _sprite: sprite } = this;
    // If add fail, set texture for sprite.
    if (!this.engine._dynamicTextAtlasManager.addSprite(sprite, canvas)) {
      const texture = new Texture2D(this.engine, width, height);
      texture.setImageSource(canvas);
      texture.generateMipmaps();
      sprite.texture = texture;
    }
    // Update sprite data.
    sprite._updateMesh();
  }

  private _updateStencilState(): void {
    // Update stencil.
    const material = this.getInstanceMaterial();
    const stencilState = material.renderState.stencilState;
    const maskInteraction = this._maskInteraction;

    if (maskInteraction === SpriteMaskInteraction.None) {
      stencilState.enabled = false;
      stencilState.writeMask = 0xff;
      stencilState.referenceValue = 0;
      stencilState.compareFunctionFront = stencilState.compareFunctionBack = CompareFunction.Always;
    } else {
      stencilState.enabled = true;
      stencilState.writeMask = 0x00;
      stencilState.referenceValue = 1;
      const compare =
        maskInteraction === SpriteMaskInteraction.VisibleInsideMask
          ? CompareFunction.LessEqual
          : CompareFunction.Greater;
      stencilState.compareFunctionFront = compare;
      stencilState.compareFunctionBack = compare;
    }
  }

  private _updatePosition(): void {
    const localPositions = this._sprite._positions;
    const localVertexPos = TextRenderer._tempVec3;
    const worldMatrix = this.entity.transform.worldMatrix;

    const { _positions } = this;
    for (let i = 0, n = _positions.length; i < n; i++) {
      const curVertexPos = localPositions[i];
      localVertexPos.setValue(curVertexPos.x, curVertexPos.y, 0);
      Vector3.transformToVec3(localVertexPos, worldMatrix, _positions[i]);
    }
  }

  private _clearTexture(): void {
    const { _sprite } = this;
    // Remove sprite from dynamic atlas.
    this.engine._dynamicTextAtlasManager.removeSprite(_sprite);
    this.shaderData.setTexture(SpriteRenderer._textureProperty, null);
    _sprite.atlasRegion = _sprite.region;
  }
}

enum DirtyFlag {
  Property = 0x1,
  MaskInteraction = 0x2,
  All = 0x3
=======
  private _getFontString() {
    let str = "";
    if (this.isBold) {
      str += "bold ";
    }
    if (this.isItalic) {
      str += "italic ";
    }
    str += `${this._fontSize}px ${this._fontName}`;
    return str;
  }

  private _updateText() {
    const fontStr = this._getFontString();
    TextUtils.measureText(TextUtils.textContext(), this, fontStr);
    this._updateTexture();
  }

  private _updateTexture() {
    const textContext = TextUtils.textContext();
    const { canvas, context } = textContext;
    if (canvas.width === 0 || canvas.height === 0) {
      this.sprite.texture = null;
      return ;
    }
    const trimData = TextUtils.trimCanvas(textContext);
    const { width, height } = trimData;
    canvas.width = width;
    canvas.height = height;
    context.putImageData(trimData.data, 0, 0);
    const texture = new Texture2D(this.engine, width, height);
    if (TextRenderer.needPremultiplyAlpha) {
      texture.setImageSource(canvas, 0, false, true);
    } else {
      texture.setImageSource(canvas);
    }
    texture.generateMipmaps();
    this.sprite.texture = texture;
  }
>>>>>>> fc710ceab08bbcd405260b1e2a781593c4708e13
}
