import { DisorderedArray } from "../../DisorderedArray";
import { EnumXRButton, XRButtonDec } from "../enum/EnumXRButton";
import { XRPose } from "./XRPose";

/**
 * XR 手柄
 */
export class XRHandle {
  pose: XRPose = new XRPose();
  /** The currently pressed buttons for this handle. */
  pressedButtons: EnumXRButton = EnumXRButton.None;
  /** @internal */
  // _events: XRInputSourceEvent[] = [];
  /** @internal */
  _upMap: number[] = [];
  /** @internal */
  _downMap: number[] = [];
  /** @internal */
  _upList: DisorderedArray<XRButtonDec> = new DisorderedArray();
  /** @internal */
  _downList: DisorderedArray<XRButtonDec> = new DisorderedArray();
}
