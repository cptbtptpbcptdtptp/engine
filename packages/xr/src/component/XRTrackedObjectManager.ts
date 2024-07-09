import { Entity, Script, XRManager } from "@galacean/engine";
import { XRFeature } from "../feature/XRFeature";
import { XRTrackableFeature } from "../feature/trackable/XRTrackableFeature";
import { XRTracked } from "../feature/trackable/XRTracked";
import { XRSessionState } from "../session/XRSessionState";
import { XRTrackedComponent } from "./XRTrackedComponent";

/**
 * 被追踪到的所有对象
 */
export class XRTrackedObjectManager<T extends XRTracked> extends Script {
  private _prefab: Entity;
  private _trackIdToIndex: number[] = [];
  private _feature: TFeatureConstructor<XRTrackableFeature>;
  private _trackedComponents: Array<XRTrackedComponent<T>> = [];

  get prefab(): Entity {
    return this._prefab;
  }

  set prefab(value: Entity) {
    this._prefab = value;
  }

  getTrackedComponentByTrackId(trackId: number): XRTrackedComponent<T> {
    const index = this._trackIdToIndex[trackId];
    return index !== undefined ? this._trackedComponents[index] : undefined;
  }

  constructor(entity: Entity, feature: TFeatureConstructor<XRTrackableFeature>) {
    super(entity);
    this._feature = feature;
    this._onXRSessionInit = this._onXRSessionInit.bind(this);
    this._onXRSessionExit = this._onXRSessionExit.bind(this);
  }

  override onEnable(): void {
    const { engine } = this;
    engine.on("XRSessionInit", this._onXRSessionInit);
    engine.on("XRSessionExit", this._onXRSessionExit);
    if (engine.xrManager?.sessionManager.state !== XRSessionState.None) {
      this._onXRSessionInit();
    }
  }

  override onDisable(): void {
    const { engine } = this;
    engine.off("XRSessionInit", this._onXRSessionInit);
    engine.off("XRSessionExit", this._onXRSessionExit);
    this._onXRSessionExit();
  }

  private _onXRSessionInit(): void {
    const feature = this._engine.xrManager.getFeature(this._feature);
    if (!feature) {
      throw new Error(`Feature not found.`);
    }
    feature.addChangedListener(this._onChanged);
  }

  private _onXRSessionExit(): void {
    this._engine.xrManager.getFeature(this._feature)?.removeChangedListener(this._onChanged);
  }

  private _onChanged(added: readonly T[], updated: readonly T[], removed: readonly T[]) {
    if (added.length > 0) {
      for (let i = 0, n = added.length; i < n; i++) {
        this._createOrUpdateTrackedComponents(added[i]);
        console.log("add", added[i].id);
      }
    }
    if (updated.length > 0) {
      for (let i = 0, n = updated.length; i < n; i++) {
        this._createOrUpdateTrackedComponents(updated[i]);
        console.log("updated", updated[i].id);
      }
    }
    if (removed.length > 0) {
      const { _trackIdToIndex: trackIdToIndex, _trackedComponents: trackedComponents } = this;
      for (let i = 0, n = removed.length; i < n; i++) {
        const { id } = removed[i];
        console.log("remove", id);
        const index = trackIdToIndex[id];
        if (index !== undefined) {
          const trackedComponent = trackedComponents[index];
          trackedComponents.splice(index, 1);
          delete trackIdToIndex[id];
          if (trackedComponent.destroyedOnRemoval) {
            trackedComponent.entity.destroy();
          } else {
            trackedComponent.entity.parent = null;
          }
        }
      }
    }
  }

  private _createOrUpdateTrackedComponents(trackedData: T): XRTrackedComponent<T> {
    let trackedComponent = this.getTrackedComponentByTrackId(trackedData.id);
    if (!trackedComponent) {
      const { _trackIdToIndex: trackIdToIndex, _trackedComponents: trackedComponents } = this;
      trackedComponent = this._createTrackedComponents(trackedData);
      trackIdToIndex[trackedData.id] = trackedComponents.length;
      trackedComponents.push(trackedComponent);
    }
    trackedComponent.data = trackedData;
    const { transform } = trackedComponent.entity;
    const { pose } = trackedData;
    transform.position = pose.position;
    transform.rotationQuaternion = pose.rotation;
    return trackedComponent;
  }

  private _createTrackedComponents(trackedData: T): XRTrackedComponent<T> {
    const { origin } = this._engine.xrManager;
    const { _prefab: prefab } = this;
    let entity: Entity;
    if (prefab) {
      entity = prefab.clone();
      entity.name = `TrackedObject${trackedData.id}`;
      origin.addChild(entity);
    } else {
      entity = origin.createChild(`TrackedObject${trackedData.id}`);
    }
    const trackedComponent = entity.addComponent(XRTrackedComponent<T>);
    return trackedComponent;
  }
}

type TFeatureConstructor<T extends XRFeature> = new (xrManager: XRManager, ...args: any[]) => T;
