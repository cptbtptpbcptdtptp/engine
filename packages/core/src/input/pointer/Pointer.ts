import { Vector2 } from "@oasis-engine/math";
import { DisorderedArray } from "../../DisorderedArray";
import { Engine } from "../../Engine";
import { Entity } from "../../Entity";
import { HitResult } from "../../physics";
import { PointerButton, _pointerBin2DecMap } from "../enums/PointerButton";
import { PointerPhase } from "../enums/PointerPhase";

/**
 * Pointer.
 */
export class Pointer {
  /**
   * Unique id.
   * @remarks Start from 0.
   */
  readonly id: number;
  /** The phase of pointer. */
  phase: PointerPhase = PointerPhase.Leave;
  /** The button that triggers the pointer event. */
  button: PointerButton;
  /** The position of the pointer in screen space pixel coordinates. */
  position: Vector2 = new Vector2();
  /** The change of the pointer. */
  deltaPosition: Vector2 = new Vector2();
  /** The currently hit result of the pointer. */
  currentHitResult: HitResult = new HitResult();
  /** @internal */
  _events: PointerEvent[] = [];
  /** @internal */
  _uniqueID: number;
  /** @internal */
  _buttons: PointerButton = PointerButton.None;
  /** @internal */
  _upMap: number[] = [];
  /** @internal */
  _downMap: number[] = [];
  /** @internal */
  _upList: DisorderedArray<PointerButton> = new DisorderedArray();
  /** @internal */
  _downList: DisorderedArray<PointerButton> = new DisorderedArray();

  private _engine: Engine;
  private _currentPressedEntity: Entity;
  private _currentEnteredEntity: Entity;

  /**
   * Whether the pointer is being held down, if there is no parameter, return whether any pointer is being held down.
   * @param pointerButton - The pointerButton on a pointer device
   * @returns Whether the pointer is being held down
   */
  isPointerHeldDown(pointerButton?: PointerButton): boolean {
    if (pointerButton === undefined) {
      return this._buttons !== 0;
    } else {
      return (this._buttons & pointerButton) !== 0;
    }
  }

  /**
   * Whether the pointer starts to be pressed down during the current frame, if there is no parameter, return whether any pointer starts to be pressed down during the current frame.
   * @param pointerButton - The pointerButton on a pointer device
   * @returns Whether the pointer starts to be pressed down during the current frame
   */
  isPointerDown(pointerButton?: PointerButton): boolean {
    if (pointerButton === undefined) {
      return this._downList.length > 0;
    } else {
      return this._downMap[_pointerBin2DecMap[pointerButton]] === this._engine.time._frameCount;
    }
  }

  /**
   * Whether the pointer is released during the current frame, if there is no parameter, return whether any pointer released during the current frame.
   * @param pointerButton - The pointerButtons on a mouse device
   * @returns Whether the pointer is released during the current frame
   */
  isPointerUp(pointerButton?: PointerButton): boolean {
    if (pointerButton === undefined) {
      return this._upList.length > 0;
    } else {
      return this._upMap[_pointerBin2DecMap[pointerButton]] === this._engine.time._frameCount;
    }
  }

  /** @internal */
  _firePointerExitAndEnter(rayCastEntity: Entity): void {
    if (this._currentEnteredEntity !== rayCastEntity) {
      if (this._currentEnteredEntity) {
        const scripts = this._currentEnteredEntity._scripts;
        for (let i = scripts.length - 1; i >= 0; i--) {
          const script = scripts.get(i);
          script._waitHandlingInValid || script.onPointerExit(this);
        }
      }
      if (rayCastEntity) {
        const scripts = rayCastEntity._scripts;
        for (let i = scripts.length - 1; i >= 0; i--) {
          const script = scripts.get(i);
          script._waitHandlingInValid || script.onPointerEnter(this);
        }
      }
      this._currentEnteredEntity = rayCastEntity;
    }
  }

  /** @internal */
  _firePointerDown(rayCastEntity: Entity): void {
    if (rayCastEntity) {
      const scripts = rayCastEntity._scripts;
      for (let i = scripts.length - 1; i >= 0; i--) {
        const script = scripts.get(i);
        script._waitHandlingInValid || script.onPointerDown(this);
      }
    }
    this._currentPressedEntity = rayCastEntity;
  }

  /** @internal */
  _firePointerDrag(): void {
    if (this._currentPressedEntity) {
      const scripts = this._currentPressedEntity._scripts;
      for (let i = scripts.length - 1; i >= 0; i--) {
        const script = scripts.get(i);
        script._waitHandlingInValid || script.onPointerDrag(this);
      }
    }
  }

  /** @internal */
  _firePointerUpAndClick(rayCastEntity: Entity): void {
    const { _currentPressedEntity: pressedEntity } = this;
    if (pressedEntity) {
      const sameTarget = pressedEntity === rayCastEntity;
      const scripts = pressedEntity._scripts;
      for (let i = scripts.length - 1; i >= 0; i--) {
        const script = scripts.get(i);
        if (!script._waitHandlingInValid) {
          sameTarget && script.onPointerClick(this);
          script.onPointerUp(this);
        }
      }
      this._currentPressedEntity = null;
    }
  }

  /** @internal */
  _destroy() {
    this.position = this.deltaPosition = null;
    this.currentHitResult = null;
    this._currentPressedEntity = null;
    this._currentPressedEntity = null;
    this._downMap.length = this._upMap.length = 0;
    this._downList.length = this._upList.length = 0;
  }

  /**
   * @internal
   */
  constructor(engine: Engine, id: number) {
    this._engine = engine;
    this.id = id;
  }
}
