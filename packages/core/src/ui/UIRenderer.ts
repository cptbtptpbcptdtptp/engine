import { DependentMode, dependentComponents } from "../ComponentsDependencies";
import { Entity } from "../Entity";
import { RenderContext } from "../RenderPipeline/RenderContext";
import { MBChunk } from "../RenderPipeline/batcher/MeshBuffer";
import { Renderer } from "../Renderer";
import { ignoreClone } from "../clone/CloneManager";
import { ShaderMacroCollection } from "../shader/ShaderMacroCollection";
import { UICanvas } from "./UICanvas";
import { UITransform, UITransformModifyFlags } from "./UITransform";

@dependentComponents(UITransform, DependentMode.AutoAdd)
export class UIRenderer extends Renderer {
  protected _canvas: UICanvas;
  protected _uiTransform: UITransform;

  /** @internal */
  @ignoreClone
  _chunk: MBChunk;

  get canvas(): UICanvas {
    return this._canvas;
  }

  set canvas(val: UICanvas) {
    if (this._canvas !== val) {
      this._canvas = val;
    }
  }

  /**
   * @internal
   */
  constructor(entity: Entity) {
    super(entity);
    this._uiTransform = entity.getComponent(UITransform);
  }

  override _validityCheck(): boolean {
    return !!this._canvas;
  }

  /**
   * @internal
   */
  override _prepareRender(context: RenderContext): void {
    this._distanceForSort = this._canvas.distance;
    this._updateShaderData(context, false);
    this._render(context);
    // union camera global macro and renderer macro.
    ShaderMacroCollection.unionCollection(
      context.camera._globalShaderMacro,
      this.shaderData._macroCollection,
      this._globalShaderMacro
    );
  }

  /**
   * @internal
   */
  override _onEnableInScene(): void {
    const componentsManager = this.scene._componentsManager;
    if (this._overrideUpdate) {
      componentsManager.addOnUpdateRenderers(this);
    }
    // componentsManager.addRenderer(this);
    this._uiTransform._updateFlagManager.addListener(this._onTransformChanged);
  }

  /**
   * @internal
   */
  override _onDisableInScene(): void {
    const componentsManager = this.scene._componentsManager;
    if (this._overrideUpdate) {
      componentsManager.removeOnUpdateRenderers(this);
    }
    // componentsManager.removeRenderer(this);
    this._uiTransform._updateFlagManager.removeListener(this._onTransformChanged);
  }

  protected _onUITransformChanged(flag: UITransformModifyFlags): void {}
}
