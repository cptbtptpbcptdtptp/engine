import { Vector3 } from "@oasis-engine/math";
import { Engine } from "../../Engine";
import { IInput } from "../interface/IInput";

/**
 * Wheel Manager.
 * @internal
 */
export class WheelManager implements IInput {
  /** Whether to prevent events from triggering the default behavior. */
  preventDefault: boolean = false;
  /** Whether to prevent the propagation of events during capture and bubbling */
  stopPropagation: boolean = false;

  /** @internal */
  _delta: Vector3 = new Vector3();

  private _nativeEvents: WheelEvent[] = [];
  private _enable: boolean = true;
  private _target: EventTarget;
  private _focus: boolean = true;
  private _hadListener: boolean = false;

  /**
   * The listener element for this input.
   */
  get target(): EventTarget {
    return this._target;
  }

  set target(target: EventTarget) {
    if (this._target !== target) {
      this._target = target;
      this._removeListener();
      this._enable && this._focus && this._addListener();
    }
  }

  /**
   * If the input is enabled.
   */
  get enable(): boolean {
    return this._enable;
  }

  set enable(value: boolean) {
    if (this._focus !== value) {
      this._focus = value;
      if (value) {
        this._focus && this._addListener();
      } else {
        this._removeListener();
      }
    }
  }

  /**
   * If the input has focus.
   */
  get focus(): boolean {
    return this._focus;
  }

  set focus(value: boolean) {
    if (this._focus !== value) {
      this._focus = value;
      if (value) {
        this._enable && this._addListener();
      } else {
        this._removeListener();
      }
    }
  }

  /**
   * Create a KeyboardManager.
   */
  constructor(engine: Engine) {
    // @ts-ignore
    this._target = engine.canvas._webCanvas;
    this._onWheelEvent = this._onWheelEvent.bind(this);
    this._addListener();
  }

  /**
   * @internal
   */
  _update(): void {
    const { _delta: delta } = this;
    delta.set(0, 0, 0);
    const { _nativeEvents: nativeEvents } = this;
    if (nativeEvents.length > 0) {
      for (let i = nativeEvents.length - 1; i >= 0; i--) {
        const evt = nativeEvents[i];
        delta.x += evt.deltaX;
        delta.y += evt.deltaY;
        delta.z += evt.deltaZ;
      }
      nativeEvents.length = 0;
    }
  }

  /**
   * @internal
   */
  _destroy(): void {
    this._removeListener();
    this._delta = null;
    this._nativeEvents = null;
  }

  private _addListener(): void {
    if (!this._hadListener) {
      this._target.addEventListener("wheel", this._onWheelEvent);
      this._hadListener = true;
    }
  }

  private _removeListener(): void {
    if (this._hadListener) {
      this._target.removeEventListener("wheel", this._onWheelEvent);
      this._nativeEvents.length = 0;
      this._delta.set(0, 0, 0);
      this._hadListener = false;
    }
  }

  private _onWheelEvent(evt: WheelEvent): void {
    this.preventDefault && evt.cancelable && evt.preventDefault();
    this.stopPropagation && evt.stopPropagation();
    this._nativeEvents.push(evt);
  }
}
