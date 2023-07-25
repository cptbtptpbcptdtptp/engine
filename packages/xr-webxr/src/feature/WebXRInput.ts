// import { Engine } from "@galacean/engine-core";
// import { WebXRProvider } from "../WebXRProvider";

// export class WebXRInput extends XRInput {
//   private _events: XRInputSourceEvent[] = [];
//   private _sources: XRInputSource[] = [];
//   private _provider: WebXRProvider;

//   override attach(): boolean {
//     this._addListener();
//     return true;
//   }

//   override detach(): boolean {
//     this._removeListener();
//     return true;
//   }

//   override destroy(): void {
//     this._removeListener();
//   }

//   updatePoses(poses: XRPose[]) {
//     const { _sources: sources } = this;
//     const { _frame: frame, _space: space } = this._provider;
//     // Handle
//     sources.forEach((input) => {
//       if (!!input) {
//         const { transform } = frame.getPose(input.gripSpace, space);
//         if (transform) {
//           const poseSource = this._getHandleSource(input.handedness);
//           const pose = (poses[poseSource] ||= new XRPose());
//           pose.matrix.copyFromArray(transform.matrix);
//           pose.position.copyFrom(transform.position);
//           pose.quaternion.copyFrom(transform.orientation);
//         }
//       }
//     });

//     // Camera
//     const viewerPose = frame.getViewerPose(space);
//     if (viewerPose) {
//       const views = viewerPose.views;
//       for (let i = 0, n = views.length; i < n; i++) {
//         const { eye, transform } = views[i];
//         const poseSource = this._getCameraSource(eye);
//         const pose = (poses[poseSource] ||= new XRPose());
//         pose.matrix.copyFromArray(transform.matrix);
//         pose.position.copyFrom(transform.position);
//         pose.quaternion.copyFrom(transform.orientation);
//       }
//     }
//   }

//   override update(): void {
//     const { _events: events, _xrHandles: xrHandles } = this;
//     const { frameCount } = this._engine.time;
//     for (let i = 0; i < events.length; i++) {
//       const event = events[i];
//       xrHandles[this._getHandleSource(event.inputSource.handedness)]._events.push(event);
//     }

//     xrHandles.forEach((xrHandle) => {
//       if (!xrHandle) {
//         return;
//       }
//       const handleEvents = xrHandle._events;
//       for (let j = 0; j < handleEvents.length; j++) {
//         const handleEvent = handleEvents[j];
//         switch (handleEvent.type) {
//           case "selectstart":
//             xrHandle._downList.add(XRButtonDec.Select);
//             xrHandle._downMap[XRButtonDec.Select] = frameCount;
//             xrHandle.pressedButtons |= EnumXRButton.Select;
//             break;
//           case "selectend":
//             xrHandle._upList.add(XRButtonDec.Select);
//             xrHandle._upMap[XRButtonDec.Select] = frameCount;
//             xrHandle.pressedButtons &= ~EnumXRButton.Select;
//             break;
//           case "squeezestart":
//             xrHandle._downList.add(XRButtonDec.Squeeze);
//             xrHandle._downMap[XRButtonDec.Squeeze] = frameCount;
//             xrHandle.pressedButtons |= EnumXRButton.Squeeze;
//             break;
//           case "squeezeend":
//             xrHandle._upList.add(XRButtonDec.Squeeze);
//             xrHandle._upMap[XRButtonDec.Squeeze] = frameCount;
//             xrHandle.pressedButtons &= ~EnumXRButton.Squeeze;
//             break;
//           default:
//             break;
//         }
//       }
//       handleEvents.length = 0;
//       events.length = 0;
//     });
//   }

//   private _onSessionEvent(event: XRInputSourceEvent) {
//     this._events.push(event);
//   }

//   private _onInputSourcesChange(event: XRInputSourceChangeEvent) {
//     const session = this._provider._session;
//     const { _sources: inputs } = this;
//     if (!session) {
//       inputs.length = 0;
//       return;
//     }
//     const { inputSources } = session;
//     for (let i = 0, n = inputSources.length; i < n; i++) {
//       const inputSource = inputSources[i];
//       inputs[this._getInputSource(inputSource.handedness)] = inputSource;
//     }
//     const { removed, added } = event;
//     for (let i = 0, n = removed.length; i < n; i++) {
//       const handedness = XRHandedness[event.removed[i].handedness];
//       inputs[handedness] = null;
//     }
//     for (let i = 0, n = added.length; i < n; i++) {
//       const inputSource = event.added[i];
//       inputs[XRHandedness[inputSource.handedness]] = inputSource;
//     }
//   }

//   private _addListener() {
//     const { _session: session } = this._provider;
//     const { _onSessionEvent, _onInputSourcesChange } = this;
//     session.addEventListener("select", _onSessionEvent);
//     session.addEventListener("selectstart", _onSessionEvent);
//     session.addEventListener("selectend", _onSessionEvent);
//     session.addEventListener("squeeze", _onSessionEvent);
//     session.addEventListener("squeezestart", _onSessionEvent);
//     session.addEventListener("squeezeend", _onSessionEvent);
//     session.addEventListener("inputsourceschange", _onInputSourcesChange);
//   }

//   private _removeListener() {
//     const { _session: session } = this._provider;
//     const { _onSessionEvent, _onInputSourcesChange } = this;
//     session.removeEventListener("select", _onSessionEvent);
//     session.removeEventListener("selectstart", _onSessionEvent);
//     session.removeEventListener("selectend", _onSessionEvent);
//     session.removeEventListener("squeeze", _onSessionEvent);
//     session.removeEventListener("squeezestart", _onSessionEvent);
//     session.removeEventListener("squeezeend", _onSessionEvent);
//     session.removeEventListener("inputsourceschange", _onInputSourcesChange);
//   }

//   private _getHandleSource(handedness: XRHandedness): EnumXRInputSource {
//     switch (handedness) {
//       case "left":
//         return EnumXRInputSource.LeftHandle;
//       case "right":
//         return EnumXRInputSource.RightHandle;
//       default:
//         return EnumXRInputSource.Handler;
//     }
//   }

//   private _getCameraSource(handedness: XREye): EnumXRInputSource {
//     switch (handedness) {
//       case "left":
//         return EnumXRInputSource.LeftHandle;
//       case "right":
//         return EnumXRInputSource.RightHandle;
//       default:
//         return EnumXRInputSource.Handler;
//     }
//   }

//   constructor(engine: Engine) {
//     super(engine);
//     this._onSessionEvent = this._onSessionEvent.bind(this);
//     this._onInputSourcesChange = this._onInputSourcesChange.bind(this);
//   }
// }
