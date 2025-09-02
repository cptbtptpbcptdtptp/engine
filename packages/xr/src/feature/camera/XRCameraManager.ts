import { Camera, CameraClearFlags, CameraType, Matrix, ShaderMacro } from "@galacean/engine";
import { XRCamera } from "../../input/XRCamera";
import { XRTrackedInputDevice } from "../../input/XRTrackedInputDevice";
import { XRSessionState } from "../../session/XRSessionState";
import { XRManagerExtended } from "../../XRManagerExtended";
import { XRStereoRenderMode } from "../../XRStereoRenderMode";

/**
 * The manager of XR camera.
 */
export class XRCameraManager {
  private static _singlePassMultiViewMacro: ShaderMacro = ShaderMacro.getByName("SINGLE_PASS_MULTI_VIEW");

  /**
   * The fixed foveation of the camera.
   */
  get fixedFoveation(): number {
    const { _platformSession: platformSession } = this._xrManager.sessionManager;
    if (platformSession) {
      return platformSession.getFixedFoveation();
    } else {
      throw new Error("XR session is not available.");
    }
  }

  set fixedFoveation(value: number) {
    const { _platformSession: platformSession } = this._xrManager.sessionManager;
    if (platformSession) {
      platformSession.setFixedFoveation(value);
    } else {
      throw new Error("XR session is not available.");
    }
  }

  /**
   * @internal
   */
  constructor(private _xrManager: XRManagerExtended) { }

  /**
   * Attach the camera to the specified input type(Camera, LeftCamera or RightCamera).
   * The camera entity need to be moved to the XROrigin entity.
   * @param type - The input type
   * @param camera - The camera to be attached
   */
  attachCamera(
    type: XRTrackedInputDevice.Camera | XRTrackedInputDevice.LeftCamera | XRTrackedInputDevice.RightCamera,
    camera: Camera
  ): void {
    const xrCamera = this._xrManager.inputManager.getTrackedDevice<XRCamera>(type);
    const preCamera = xrCamera._camera;
    if (preCamera !== camera) {
      // @ts-ignore
      preCamera && (preCamera._cameraType = CameraType.Normal);
      switch (type) {
        case XRTrackedInputDevice.Camera:
          // @ts-ignore
          camera._cameraType = CameraType.XRCenterCamera;
          break;
        case XRTrackedInputDevice.LeftCamera:
          // @ts-ignore
          camera._cameraType = CameraType.XRLeftCamera;
          break;
        case XRTrackedInputDevice.RightCamera:
          // @ts-ignore
          camera._cameraType = CameraType.XRRightCamera;
          break;
        default:
          break;
      }
      xrCamera._camera = camera;
    }
  }

  /**
   * Detach the camera from the specified input type.
   * @param type - The input type
   * @returns The camera that was detached
   */
  detachCamera(
    type: XRTrackedInputDevice.Camera | XRTrackedInputDevice.LeftCamera | XRTrackedInputDevice.RightCamera
  ): Camera {
    const xrCamera = this._xrManager.inputManager.getTrackedDevice<XRCamera>(type);
    const preCamera = xrCamera._camera;
    // @ts-ignore
    preCamera && (preCamera._cameraType = CameraType.Normal);
    xrCamera._camera = null;
    return preCamera;
  }

  /**
   * @internal
   */
  _getCamera(type: XRTrackedInputDevice.Camera | XRTrackedInputDevice.LeftCamera | XRTrackedInputDevice.RightCamera) {
    return this._xrManager.inputManager.getTrackedDevice<XRCamera>(type);
  }

  /**
   * @internal
   */
  _onSessionStart(): void { }

  /**
   * @internal
   */
  _onUpdate(): void {
    const { _cameras: cameras } = this._xrManager.inputManager;
    for (let i = 0, n = cameras.length; i < n; i++) {
      const cameraDevice = cameras[i];
      const { _camera: camera } = cameraDevice;
      if (!camera) continue;
      // sync position and rotation
      const { transform } = camera.entity;
      const { pose } = cameraDevice;
      transform.position = pose.position;
      transform.rotationQuaternion = pose.rotation;
      // sync viewport
      const { viewport } = camera;
      const { x, y, width, height } = cameraDevice.viewport;
      if (!(x === viewport.x && y === viewport.y && width === viewport.z && height === viewport.w)) {
        camera.viewport = viewport.set(x, y, width, height);
      }
      // sync project matrix
      if (!Matrix.equals(camera.projectionMatrix, cameraDevice.projectionMatrix)) {
        camera.projectionMatrix = cameraDevice.projectionMatrix;
      }
    }
  }

  /**
   * @internal
   */
  _onSessionExit(): void { }

  /**
   * @internal
   */
  _getIgnoreClearFlags(cameraType: CameraType): CameraClearFlags {
    if (cameraType === CameraType.XRCenterCamera) {
      if (this._xrManager.sessionManager.state === XRSessionState.Running) {
        return CameraClearFlags.Color;
      } else {
        return CameraClearFlags.None;
      }
    } else {
      return CameraClearFlags.None;
    }
  }

  /**
   * @internal
   */
  _onDestroy(): void { }

  /**
   * @internal
   */
  _onStereoRenderModeChange(value: XRStereoRenderMode): void {
    const macro = XRCameraManager._singlePassMultiViewMacro;
    if (value) {
      this._getCamera(XRTrackedInputDevice.Camera)?._camera?.shaderData.enableMacro(macro);
      this._getCamera(XRTrackedInputDevice.LeftCamera)?._camera?.shaderData.enableMacro(macro);
      this._getCamera(XRTrackedInputDevice.RightCamera)?._camera?.shaderData.enableMacro(macro);
    } else {
      this._getCamera(XRTrackedInputDevice.Camera)?._camera?.shaderData.disableMacro(macro);
      this._getCamera(XRTrackedInputDevice.LeftCamera)?._camera?.shaderData.disableMacro(macro);
      this._getCamera(XRTrackedInputDevice.RightCamera)?._camera?.shaderData.disableMacro(macro);
    }
  }
}
