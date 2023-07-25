import { IXRFeatureLifecycle } from "./feature/IXRFeature";

/**
 * The interface of xr creation.
 */
export interface IXRProvider {
  name: string;
  supportedMode(): Promise<void>;
  supportedFeature(): Promise<void>;
  initialize(): Promise<void>;
  createFeature(): Promise<IXRFeatureLifecycle>;
}
