import { Vector3 } from "@oasis-engine/math";
import { InputType } from "../enums/InputType";
import { InputManager } from "../InputManager";
import { IInput } from "../interface/IInput";

/**
 * Wheel Manager.
 * @internal
 */
export class WheelManager implements IInput {
  /** @internal */
  _delta: Vector3 = new Vector3();

  private _enable: boolean = true;
  private _target: HTMLElement = null;
  private _preventDefault: boolean = false;
  private _stopPropagation: boolean = false;
  private _nativeEvents: WheelEvent[] = [];
  private _hadListener: boolean = false;

  get enable() {
    return this._enable;
  }

  set enable(value: boolean) {
    if (this._enable !== value) {
      this._enable = value;
      if (value) {
        this._onFocus();
      } else {
        this._onBlur();
      }
    }
  }

  get target() {
    return this._target;
  }

  set target(value: HTMLElement) {
    if (this._target !== value) {
      this._onBlur();
      this._target = value;
      this._onFocus();
    }
  }

  get preventDefault() {
    return this._preventDefault;
  }

  set preventDefault(value: boolean) {
    this._preventDefault = value;
  }

  get stopPropagation() {
    return this._stopPropagation;
  }

  set stopPropagation(value: boolean) {
    this._stopPropagation = value;
  }

  /**
   * Create a KeyboardManager.
   */
  constructor() {
    this._onWheelEvent = this._onWheelEvent.bind(this);
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
  _onFocus(): void {
    if (!this._hadListener && this._target) {
      this._target.addEventListener("wheel", this._onWheelEvent);
      this._hadListener = true;
    }
  }

  /**
   * @internal
   */
  _onBlur(): void {
    if (this._hadListener) {
      this._target.removeEventListener("wheel", this._onWheelEvent);
      this._nativeEvents.length = 0;
      this._delta.set(0, 0, 0);
      this._hadListener = false;
    }
  }

  /**
   * @internal
   */
  _destroy(): void {
    if (this._hadListener) {
      this._target.removeEventListener("wheel", this._onWheelEvent);
      this._hadListener = false;
    }
    this._nativeEvents = null;
  }

  private _onWheelEvent(evt: WheelEvent): void {
    evt.cancelable && evt.preventDefault();
    this._nativeEvents.push(evt);
  }
}

InputManager.registerInput(InputType.Wheel, WheelManager);
