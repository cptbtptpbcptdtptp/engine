import { Camera } from "../Camera";
import { Component } from "../Component";
import { DependentMode, dependentComponents } from "../ComponentsDependencies";
import { DisorderedArray } from "../DisorderedArray";
import { Entity } from "../Entity";
import { RenderContext } from "../RenderPipeline/RenderContext";
import { RenderData } from "../RenderPipeline/RenderData";
import { UIRenderElement } from "../RenderPipeline/UIRenderElement";
import { Renderer } from "../Renderer";
import { ignoreClone } from "../clone/CloneManager";
import { UIRenderer } from "./UIRenderer";
import { UITransform } from "./UITransform";
import { CanvasRenderMode } from "./enums/CanvasRenderMode";
import { ResolutionAdaptationStrategy } from "./enums/ResolutionAdaptationStrategy";

@dependentComponents(UITransform, DependentMode.AutoAdd)
export class UICanvas extends Component {
  /** @internal */
  @ignoreClone
  _uiCanvasIndex: number = -1;

  private _renderMode: CanvasRenderMode = CanvasRenderMode.ScreenSpaceOverlay;
  private _renderCamera: Camera;
  private _resolutionAdaptationStrategy: ResolutionAdaptationStrategy = ResolutionAdaptationStrategy.BothAdaptation;
  private _sortOrder: number = 0;
  private _distance: number = 0;
  /** @internal */
  private _renderers: UIRenderer[] = [];
  private _renderData: RenderData[] = [];

  get renderMode(): CanvasRenderMode {
    return this._renderMode;
  }

  set renderMode(mode: CanvasRenderMode) {
    if (this._renderMode !== mode) {
      this._renderMode = mode;
    }
  }

  get renderCamera(): Camera {
    return this._renderCamera;
  }

  set renderCamera(val: Camera) {
    if (this._renderCamera !== val) {
      this._renderCamera = val;
    }
  }

  get resolutionAdaptationStrategy(): ResolutionAdaptationStrategy {
    return this._resolutionAdaptationStrategy;
  }

  set resolutionAdaptationStrategy(val: ResolutionAdaptationStrategy) {}

  get sortOrder(): number {
    return this._sortOrder;
  }

  set sortOrder(val: number) {
    if (this._sortOrder !== val) {
      this._sortOrder = val;
    }
  }

  get distance(): number {
    return this._distance;
  }

  set distance(val: number) {
    if (this._distance !== val) {
      this._distance = val;
    }
  }

  // 排序 & 合批
  _prepareRender(context: RenderContext): void {
    const { _renderers: renderers } = this;
    // 先清空，后续需要设置 dirty
    renderers.length = 0;
    this._walk(this.entity, renderers);
    for (let i = 0, n = renderers.length; i < n; i++) {
      renderers[i]._prepareRender(context);
    }
  }

  /**
   * @internal
   */
  override _onEnableInScene(): void {
    this.scene._componentsManager.addUICanvas(this);
  }

  /**
   * @internal
   */
  override _onDisableInScene(): void {
    this.scene._componentsManager.removeUICanvas(this);
  }

  private _walk(entity: Entity, out: UIRenderer[]): void {
    const { _children: children } = entity;
    for (let i = 0, n = children.length; i < n; i++) {
      const { _components: components } = children[i];
      for (let j = 0, m = components.length; j < m; j++) {
        const component = components[i];
        component instanceof UIRenderer && out.push(component);
      }
    }
  }
}
