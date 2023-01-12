import { Engine } from "../Engine";
import { KeyboardManager } from "./keyboard/KeyboardManager";
import { Keys } from "./enums/Keys";
import { Pointer } from "./pointer/Pointer";
import { PointerManager } from "./pointer/PointerManager";
import { PointerButton, _pointerBin2DecMap } from "./enums/PointerButton";
import { WheelManager } from "./wheel/WheelManager";
import { Vector3 } from "@oasis-engine/math";
import { IInput } from "./interface/IInput";
import { InputType } from "./enums/InputType";
import { IInputSetting } from "./interface/IInputSetting";

/**
 * InputManager manages device input such as mouse, touch, keyboard, etc.
 */
export class InputManager {
  static _inputClassMap: (new () => IInput)[] = new Array<new () => IInput>(InputType.length);

  static registerInput(inputType: InputType, input: new () => IInput) {
    this._inputClassMap[inputType] = input;
  }

  private _engine: Engine;
  private _enableFocusAndBlur: boolean = false;
  private _inputSetting: IInputSetting[] = new Array<IInputSetting>(InputType.length);
  private _inputInstances: IInput[] = new Array<IInput>(InputType.length);
  private _inputEnableMap: boolean[] = new Array<boolean>(InputType.length);

  /**
   * Pointer list.
   */
  get pointers(): Readonly<Pointer[]> {
    const pointerManager = this.getInput<PointerManager>(InputType.Pointer);
    return pointerManager ? pointerManager._pointers : [];
  }

  /**
   *  Whether to handle multi-pointer.
   */
  get multiPointerEnabled(): boolean {
    const pointerManager = this.getInput<PointerManager>(InputType.Pointer);
    return pointerManager ? pointerManager._multiPointerEnabled : false;
  }

  set multiPointerEnabled(enabled: boolean) {
    const pointerManager = this.getInput<PointerManager>(InputType.Pointer);
    pointerManager && (pointerManager._multiPointerEnabled = enabled);
  }

  get enableFocusAndBlur(): boolean {
    return this._enableFocusAndBlur;
  }

  set enableFocusAndBlur(value: boolean) {
    if (this._enableFocusAndBlur !== value) {
      this._enableFocusAndBlur = value;
      if (value) {
        window.addEventListener("blur", this._onBlur);
        window.addEventListener("focus", this._onFocus);
      } else {
        window.removeEventListener("blur", this._onBlur);
        window.removeEventListener("focus", this._onFocus);
      }
    }
  }

  /**
   * Get the change of the scroll wheel on the x-axis.
   * @returns Change value
   */
  get wheelDelta(): Readonly<Vector3 | null> {
    const wheelManager = this.getInput<WheelManager>(InputType.Wheel);
    return wheelManager ? wheelManager._delta : null;
  }

  getInput<T>(inputType: InputType): T {
    return this._inputInstances[inputType] as T;
  }

  enableInput(inputType: InputType) {
    if (!this._inputEnableMap[inputType]) {
      this._inputEnableMap[inputType] = true;
      if (this._inputInstances[inputType]) {
        this._inputInstances[inputType].enable = true;
      }
    }
  }

  disableInput(inputType: InputType) {
    if (!!this._inputEnableMap[inputType]) {
      this._inputEnableMap[inputType] = false;
      if (this._inputInstances[inputType]) {
        this._inputInstances[inputType].enable = false;
      }
    }
  }

  getInputSetting(inputType: InputType): IInputSetting {
    return this._inputSetting[inputType];
  }

  setTarget(inputType: InputType, target: HTMLElement) {
    if (this._inputSetting[inputType]) {
      this._inputSetting[inputType].target = target;
    } else {
      this._inputSetting[inputType] = { target };
    }
    if (this._inputInstances[inputType]) {
      this._inputInstances[inputType].target = target;
    }
  }

  setPreventDefault(inputType: InputType, preventDefault: boolean) {
    if (this._inputSetting[inputType]) {
      this._inputSetting[inputType].preventDefault = preventDefault;
    } else {
      this._inputSetting[inputType] = { preventDefault };
    }
    if (this._inputInstances[inputType]) {
      this._inputInstances[inputType].preventDefault = preventDefault;
    }
  }

  setStopPropagation(inputType: InputType, stopPropagation: boolean) {
    if (this._inputSetting[inputType]) {
      this._inputSetting[inputType].stopPropagation = stopPropagation;
    } else {
      this._inputSetting[inputType] = { stopPropagation };
    }
    if (this._inputInstances[inputType]) {
      this._inputInstances[inputType].stopPropagation = stopPropagation;
    }
  }

  /**
   * Whether the key is being held down, if there is no parameter, return whether any key is being held down.
   * @param key - The keys of the keyboard
   * @returns Whether the key is being held down
   */
  isKeyHeldDown(key?: Keys): boolean {
    const keyboardManager = this.getInput<KeyboardManager>(InputType.Keyboard);
    if (keyboardManager) {
      if (key === undefined) {
        return keyboardManager._curFrameHeldDownList.length > 0;
      } else {
        return keyboardManager._curHeldDownKeyToIndexMap[key] != null;
      }
    } else {
      return false;
    }
  }

  /**
   * Whether the key starts to be pressed down during the current frame, if there is no parameter, return whether any key starts to be pressed down during the current frame.
   * @param key - The keys of the keyboard
   * @returns Whether the key starts to be pressed down during the current frame
   */
  isKeyDown(key?: Keys): boolean {
    const keyboardManager = this.getInput<KeyboardManager>(InputType.Keyboard);
    if (keyboardManager) {
      if (key === undefined) {
        return keyboardManager._curFrameDownList.length > 0;
      } else {
        return keyboardManager._downKeyToFrameCountMap[key] === this._engine.time._frameCount;
      }
    } else {
      return false;
    }
  }

  /**
   * Whether the key is released during the current frame, if there is no parameter, return whether any key released during the current frame.
   * @param key - The keys of the keyboard
   * @returns Whether the key is released during the current frame
   */
  isKeyUp(key?: Keys): boolean {
    const keyboardManager = this.getInput<KeyboardManager>(InputType.Keyboard);
    if (keyboardManager) {
      if (key === undefined) {
        return keyboardManager._curFrameUpList.length > 0;
      } else {
        return keyboardManager._upKeyToFrameCountMap[key] === this._engine.time._frameCount;
      }
    } else {
      return false;
    }
  }

  /**
   * Whether the pointer is being held down, if there is no parameter, return whether any pointer is being held down.
   * @param pointerButton - The pointerButton on a pointer device
   * @returns Whether the pointer is being held down
   */
  isPointerHeldDown(pointerButton?: PointerButton): boolean {
    const pointerManager = this.getInput<PointerManager>(InputType.Pointer);
    if (pointerManager) {
      if (pointerButton === undefined) {
        return pointerManager._buttons !== 0;
      } else {
        return (pointerManager._buttons & pointerButton) !== 0;
      }
    } else {
      return false;
    }
  }

  /**
   * Whether the pointer starts to be pressed down during the current frame, if there is no parameter, return whether any pointer starts to be pressed down during the current frame.
   * @param pointerButton - The pointerButton on a pointer device
   * @returns Whether the pointer starts to be pressed down during the current frame
   */
  isPointerDown(pointerButton?: PointerButton): boolean {
    const pointerManager = this.getInput<PointerManager>(InputType.Pointer);
    if (pointerManager) {
      if (pointerButton === undefined) {
        return pointerManager._downList.length > 0;
      } else {
        return pointerManager._downMap[_pointerBin2DecMap[pointerButton]] === this._engine.time._frameCount;
      }
    } else {
      return false;
    }
  }

  /**
   * Whether the pointer is released during the current frame, if there is no parameter, return whether any pointer released during the current frame.
   * @param pointerButton - The pointerButtons on a mouse device
   * @returns Whether the pointer is released during the current frame
   */
  isPointerUp(pointerButton?: PointerButton): boolean {
    const pointerManager = this.getInput<PointerManager>(InputType.Pointer);
    if (pointerManager) {
      if (pointerButton === undefined) {
        return pointerManager._upList.length > 0;
      } else {
        return pointerManager._upMap[_pointerBin2DecMap[pointerButton]] === this._engine.time._frameCount;
      }
    } else {
      return false;
    }
  }

  /**
   * @internal
   */
  constructor(engine: Engine) {
    this._engine = engine;
    // @ts-ignore
    const canvas = engine._canvas._webCanvas;
    if (typeof OffscreenCanvas === "undefined" || !(canvas instanceof OffscreenCanvas)) {
      this.enableInput(InputType.Pointer);
      this.enableInput(InputType.Keyboard);
      this.enableInput(InputType.Wheel);
      this._onBlur = this._onBlur.bind(this);
      this._onFocus = this._onFocus.bind(this);
      if (this._enableFocusAndBlur) {
        window.addEventListener("blur", this._onBlur);
        window.addEventListener("focus", this._onFocus);
      }
    }
  }

  /**
   * @internal
   */
  _update(): void {
    const { _inputInstances: _inputInsMap, _inputEnableMap: inputEnableMap } = this;
    for (let i = 0, l = InputType.length; i < l; i++) {
      !!inputEnableMap[i] && _inputInsMap[i]?._update();
    }
  }

  /**
   * @internal
   */
  _destroy(): void {
    window.removeEventListener("blur", this._onBlur);
    window.removeEventListener("focus", this._onFocus);
    const { _inputInstances: _inputInsMap } = this;
    for (let i = 0, l = InputType.length; i < l; i++) {
      _inputInsMap[i]?._destroy();
    }
  }

  private _onBlur(): void {
    const { _inputInstances: _inputInsMap, _inputEnableMap: inputEnableMap } = this;
    for (let i = 0, l = InputType.length; i < l; i++) {
      !!inputEnableMap[i] && _inputInsMap[i]?._onBlur();
    }
  }

  private _onFocus(): void {
    const { _inputInstances: _inputInsMap, _inputEnableMap: inputEnableMap } = this;
    for (let i = 0, l = InputType.length; i < l; i++) {
      !!inputEnableMap[i] && _inputInsMap[i]?._onFocus();
    }
  }
}
