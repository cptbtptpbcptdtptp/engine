export interface IInput {
  get enable();
  set enable(value: boolean);

  get target();
  set target(value: HTMLElement);

  get preventDefault();
  set preventDefault(value: boolean);

  get stopPropagation();
  set stopPropagation(value: boolean);
  /**
   * Handler function updated every frame.
   */
  _update(frameCount?: number): void;
  /**
   * Function called when the engine is destroyed.
   */
  _destroy(): void;
  /**
   * Function called when focused.
   */
  _onFocus(): void;
  /**
   * Function called when focus is lost.
   */
  _onBlur(): void;
}
