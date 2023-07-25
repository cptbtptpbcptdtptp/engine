// import { Matrix, Vector4 } from "@galacean/engine-math";
// import { XRSubsystem } from "../../../abstract/XRSubsystem";
// import { registerXRSubsystem } from "../../../XRSubsystemManager";
// import { EnumXRSubsystem } from "../../../enum/EnumXRSubsystem";
// import { XRCamera } from "../../../data/XRCamera";
// import { IXRSubsystemDescriptor } from "../../../interface/IXRSubsystemDescriptor";
// import { WebXRProvider } from "../WebXRProvider";
// import { EnumXRCamera } from "../../../enum/EnumXRCamera";

// @registerXRSubsystem(EnumXRSubsystem.display)
// export class WebXRDisplaySubsystem extends XRSubsystem {
//   private _cameras: XRCamera[];
//   private _provider: WebXRProvider;

//   override update(): void {
//     // Camera
//     const { _cameras: cameras } = this;
//     const { _frame: xrFrame, _space: xrSpace, _layer: layer } = this._provider;
//     const viewerPose = xrFrame.getViewerPose(xrSpace);
//     if (!viewerPose) return;
//     const views = viewerPose.views;
//     for (let i = 0, n = views.length; i < n; i++) {
//       const view = views[i];
//       const camera = (cameras[EnumXRCamera[view.eye]] ||= {
//         project: new Matrix(),
//         viewport: new Vector4(0, 0, 1, 1)
//       });
//       camera.project.copyFromArray(view.projectionMatrix);
//       if (layer) {
//         const { framebufferWidth, framebufferHeight } = layer;
//         camera.frameWidth = framebufferWidth;
//         camera.frameHeight = framebufferHeight;
//         const xrViewport = layer.getViewport(view);
//         const width = xrViewport.width / framebufferWidth;
//         const height = xrViewport.height / framebufferHeight;
//         const x = xrViewport.x / framebufferWidth;
//         const y = 1 - xrViewport.y / framebufferHeight - height;
//         camera.viewport.set(x, y, width, height);
//       }
//     }
//   }
//   override start(): void {}
//   override stop(): void {}
//   override destroy(): void {}

//   constructor(descriptor: IXRSubsystemDescriptor, provider: WebXRProvider) {
//     super(descriptor, provider);
//   }
// }
