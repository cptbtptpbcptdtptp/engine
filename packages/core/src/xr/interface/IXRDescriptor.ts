import { EnumXRFeature } from "../enum/EnumXRFeature";
import { EnumXRMode } from "../enum/EnumXRMode";
import { XRTrackingMode } from "../enum/XRTrackingMode";

export interface IXRDescriptor {
  mode: EnumXRMode;
  trackingMode?: XRTrackingMode;
  features?: EnumXRFeature[];
  /** 输出视频流尺寸 */
  pixelWidth?: number;
  pixelHeight?: number;
  /** 相机近平面 */
  near?: number;
  /** 相机远平面 */
  far?: number;
}
