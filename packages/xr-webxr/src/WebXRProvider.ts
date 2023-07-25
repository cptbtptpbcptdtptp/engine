// import { EnumXRSpaceType } from "./enum/EnumWebXRSpaceType";

// export class WebXRProvider extends XRProvider {
//   // @internal
//   static _featureTypeMap: (new () => XRFeature)[] = [];

//   // @internal
//   _engine: Engine;
//   // @internal
//   _frame: XRFrame;
//   // @internal
//   _session: XRSession;
//   // @internal
//   _layer: XRWebGLLayer;
//   // @internal
//   _space: XRReferenceSpace | XRBoundedReferenceSpace;

//   override isSupportedMode(mode: EnumXRMode): Promise<void> {
//     return new Promise((resolve, reject: (reason: Error) => any) => {
//       if (window.isSecureContext === false) {
//         reject(new Error("WebXR is available only in secure contexts (HTTPS)."));
//         return;
//       }
//       if (!navigator.xr) {
//         reject(new Error("WebXR isn't available"));
//         return;
//       }
//       let sessionMode = this._getXRSessionMode(mode);
//       if (!sessionMode) {
//         reject(new Error("mode must be a value from the XRMode."));
//         return;
//       }
//       navigator.xr.isSessionSupported(sessionMode).then(
//         (isSupported: boolean) => {
//           isSupported ? resolve() : reject(new Error("The current context doesn't support WebXR."));
//         },
//         (reason) => {
//           reject(reason);
//         }
//       );
//     });
//   }

//   override request(config: IXRDescriptor): Promise<void> {
//     return new Promise((resolve, reject) => {
//       if (this._session) {
//         resolve();
//       }
//       let sessionMode = this._getXRSessionMode(config.mode);
//       if (!sessionMode) {
//         reject(new Error("mode must be a value from the XRMode."));
//         return;
//       }
//       const { features } = config;
//       let requiredFeatures: string[];
//       if (!!features) {
//         // for (let i = 0, n = features.length; i < n; i++) {
//         //   switch (features[i]) {
//         //     case EnumXRFeature.input:
//         //       break;
//         //     default:
//         //       break;
//         //   }
//         // }
//         requiredFeatures = [EnumXRSpaceType.Local];
//       } else {
//         requiredFeatures = [EnumXRSpaceType.Local];
//       }
//       navigator.xr.requestSession(sessionMode, { requiredFeatures }).then((session) => {
//         this._session = session;
//         const gl = <WebGLRenderingContext>this._engine._hardwareRenderer.gl;
//         const attributes = gl.getContextAttributes();
//         if (!attributes) {
//           reject(Error("GetContextAttributes Error!"));
//         }
//         gl.makeXRCompatible().then(() => {
//           const scaleFactor = XRWebGLLayer.getNativeFramebufferScaleFactor(session);
//           if (session.renderState.layers === undefined || !!!this._engine._hardwareRenderer.isWebGL2) {
//             const layerInit = {
//               antialias: session.renderState.layers === undefined ? attributes.antialias : true,
//               alpha: true,
//               depth: attributes.depth,
//               stencil: attributes.stencil,
//               framebufferScaleFactor: scaleFactor
//             };
//             this._layer = new XRWebGLLayer(session, gl, layerInit);
//             session.updateRenderState({
//               baseLayer: this._layer
//             });
//           } else {
//             this._layer = new XRWebGLLayer(session, gl);
//             session.updateRenderState(<XRRenderStateInit>{
//               layers: [this._layer]
//             });
//           }
//           session
//             .requestReferenceSpace(EnumXRSpaceType.Local)
//             .then((value: XRReferenceSpace | XRBoundedReferenceSpace) => {
//               this._space = value;
//               resolve();
//             }, reject);
//         }, reject);
//       }, reject);
//     });
//   }

//   // override onStart(): Promise<void> {}

//   override onUpdate(): void {}

//   override onLateUpdate(): void {}

//   override onDestroy(): void {}

//   override onResume(): void {}

//   override onPause(): void {}

//   private _getXRSessionMode(mode: EnumXRMode): XRSessionMode {
//     switch (mode) {
//       case EnumXRMode.AR:
//         return "immersive-ar";
//       case EnumXRMode.VR:
//         return "immersive-vr";
//       default:
//         return null;
//     }
//   }

//   constructor(engine: Engine) {
//     super();
//     this._engine = engine;
//   }
// }

// export function registerXRFeature(feature: EnumXRFeature) {
//   return <T extends XRFeature>(type: new () => T) => {
//     WebXRProvider._featureTypeMap[feature] = type;
//   };
// }
