import { DisorderedArray } from "../../DisorderedArray";
import { InputType } from "../enums/InputType";
import { Keys } from "../enums/Keys";
import { InputManager } from "../InputManager";
import { IInput } from "../interface/IInput";

/**
 * Keyboard Manager.
 * @internal
 */
export class KeyboardManager implements IInput {
  /** @internal */
  _curHeldDownKeyToIndexMap: number[] = [];
  /** @internal */
  _upKeyToFrameCountMap: number[] = [];
  /** @internal */
  _downKeyToFrameCountMap: number[] = [];

  /** @internal */
  _curFrameHeldDownList: DisorderedArray<Keys> = new DisorderedArray();
  /** @internal */
  _curFrameDownList: DisorderedArray<Keys> = new DisorderedArray();
  /** @internal */
  _curFrameUpList: DisorderedArray<Keys> = new DisorderedArray();

  private _enable: boolean = false;
  private _target: HTMLElement = null;
  private _preventDefault: boolean = false;
  private _stopPropagation: boolean = false;
  private _nativeEvents: KeyboardEvent[] = [];
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
    this._onKeyEvent = this._onKeyEvent.bind(this);
    this._hadListener = true;
  }

  /**
   * @internal
   */
  _update(frameCount: number): void {
    const { _nativeEvents: nativeEvents, _curFrameDownList: curFrameDownList, _curFrameUpList: curFrameUpList } = this;
    curFrameDownList.length = 0;
    curFrameUpList.length = 0;
    if (nativeEvents.length > 0) {
      const {
        _curHeldDownKeyToIndexMap: curHeldDownKeyToIndexMap,
        _curFrameHeldDownList: curFrameHeldDownList,
        _downKeyToFrameCountMap: downKeyToFrameCountMap,
        _upKeyToFrameCountMap: upKeyToFrameCountMap
      } = this;
      for (let i = 0, n = nativeEvents.length; i < n; i++) {
        const evt = nativeEvents[i];
        const codeKey = <Keys>Keys[evt.code];
        switch (evt.type) {
          case "keydown":
            // Filter the repeated triggers of the keyboard.
            if (curHeldDownKeyToIndexMap[codeKey] == null) {
              curFrameDownList.add(codeKey);
              curFrameHeldDownList.add(codeKey);
              curHeldDownKeyToIndexMap[codeKey] = curFrameHeldDownList.length - 1;
              downKeyToFrameCountMap[codeKey] = frameCount;
            }
            break;
          case "keyup":
            const delIndex = curHeldDownKeyToIndexMap[codeKey];
            if (delIndex != null) {
              curHeldDownKeyToIndexMap[codeKey] = null;
              const swapCode = curFrameHeldDownList.deleteByIndex(delIndex);
              swapCode && (curHeldDownKeyToIndexMap[swapCode] = delIndex);
            }
            curFrameUpList.add(codeKey);
            upKeyToFrameCountMap[codeKey] = frameCount;
            break;
          default:
            break;
        }
      }
      nativeEvents.length = 0;
    }
  }

  /**
   * @internal
   */
  _onFocus(): void {
    if (!this._hadListener) {
      document.addEventListener("keydown", this._onKeyEvent);
      document.addEventListener("keyup", this._onKeyEvent);
      this._hadListener = true;
    }
  }

  /**
   * @internal
   */
  _onBlur(): void {
    if (this._hadListener) {
      document.removeEventListener("keydown", this._onKeyEvent);
      document.removeEventListener("keyup", this._onKeyEvent);
      this._curHeldDownKeyToIndexMap.length = 0;
      this._curFrameHeldDownList.length = 0;
      this._curFrameDownList.length = 0;
      this._curFrameUpList.length = 0;
      this._nativeEvents.length = 0;
      this._hadListener = false;
    }
  }

  /**
   * @internal
   */
  _destroy(): void {
    if (this._hadListener) {
      document.removeEventListener("keydown", this._onKeyEvent);
      document.removeEventListener("keyup", this._onKeyEvent);
      this._hadListener = false;
    }
    this._curHeldDownKeyToIndexMap = null;
    this._upKeyToFrameCountMap = null;
    this._downKeyToFrameCountMap = null;
    this._nativeEvents = null;

    this._curFrameHeldDownList = null;
    this._curFrameDownList = null;
    this._curFrameUpList = null;
  }

  private _onKeyEvent(evt: KeyboardEvent): void {
    this._preventDefault && evt.cancelable && evt.preventDefault();
    this._stopPropagation && evt.stopPropagation();
    this._nativeEvents.push(evt);
  }
}

InputManager.registerInput(InputType.Wheel, KeyboardManager);
