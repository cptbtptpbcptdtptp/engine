import { Entity, Script, XRManager } from "@galacean/engine";
import { XRFeature, XRTrackableFeature, XRTracked } from "@galacean/engine-xr";
import { TrackedComponent } from "./TrackedComponent";

/**
 * 被追踪到的所有对象
 */
export class XRTrackedObjectManager<T extends XRTracked> extends Script {
  private _prefab: Entity;
  private _trackIdToIndex: number[] = [];
  private _feature: TFeatureConstructor<XRTrackableFeature>;
  private _trackedComponents: Array<TrackedComponent<T>> = [];

  get prefab(): Entity {
    return this._prefab;
  }

  set prefab(value: Entity) {
    this._prefab = value;
  }

  override onAwake(): void {
    const { engine } = this;
    this._onXRSessionInit = this._onXRSessionInit.bind(this);
    this._onXRSessionExit = this._onXRSessionExit.bind(this);
    engine.on("XRSessionInit", this._onXRSessionInit);
    engine.on("XRSessionExit", this._onXRSessionExit);
  }

  constructor(entity: Entity, feature: TFeatureConstructor<XRTrackableFeature>) {
    super(entity);
    this._feature = feature;
  }

  private _onXRSessionInit(): void {
    const { _feature: feature } = this;
    if (!feature) return;
    // @ts-ignore
    this._engine.xrManager.getFeature(feature)?.addChangedListener(this._onChanged);
  }

  private _onXRSessionExit(): void {
    const { _feature: feature } = this;
    if (!feature) return;
    // @ts-ignore
    this._engine.xrManager.getFeature(feature)?.removeChangedListener(this._onChanged);
  }

  getTrackedComponentByTrackId(trackId: number): TrackedComponent<T> {
    const index = this._trackIdToIndex[trackId];
    return index !== undefined ? this._trackedComponents[index] : undefined;
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

  private _createOrUpdateTrackedComponents(sessionRelativeData: T): TrackedComponent<T> {
    let trackedComponent = this.getTrackedComponentByTrackId(sessionRelativeData.id);
    if (!trackedComponent) {
      const { _trackIdToIndex: trackIdToIndex, _trackedComponents: trackedComponents } = this;
      trackedComponent = this._createTrackedComponents(sessionRelativeData);
      trackIdToIndex[sessionRelativeData.id] = trackedComponents.length;
      trackedComponents.push(trackedComponent);
    }
    trackedComponent.data = sessionRelativeData;
    const { transform } = trackedComponent.entity;
    const { pose } = sessionRelativeData;
    transform.position = pose.position;
    transform.rotationQuaternion = pose.rotation;
    return trackedComponent;
  }

  private _createTrackedComponents(sessionRelativeData: T): TrackedComponent<T> {
    const { origin } = this._engine.xrManager;
    const { _prefab: prefab } = this;
    let entity: Entity;
    if (prefab) {
      entity = prefab.clone();
      entity.name = `TrackedObject${sessionRelativeData.id}`;
      origin.addChild(entity);
    } else {
      entity = origin.createChild(`TrackedObject${sessionRelativeData.id}`);
    }
    const trackedComponent = entity.addComponent(TrackedComponent<T>);
    return trackedComponent;
  }
}

type TFeatureConstructor<T extends XRFeature> = new (xrManager: XRManager, ...args: any[]) => T;
