export interface IInput {
  /** Whether to prevent events from triggering the default behavior. */
  preventDefault?: boolean;
  /** Whether to prevent the propagation of events during capture and bubbling */
  stopPropagation?: boolean;

  /**
   * The listener element for this input.
   */
  get target(): EventTarget;
  set target(value: EventTarget);
  /**
   * If the input is enabled.
   */
  get enable(): boolean;
  set enable(value: boolean);
  /**
   * If the input has focus.
   */
  get focus(): boolean;
  set focus(value: boolean);
  /**
   * Handler function updated every frame.
   */
  _update(): void;
  /**
   * Function called when the engine is destroyed.
   */
  _destroy(): void;
}
