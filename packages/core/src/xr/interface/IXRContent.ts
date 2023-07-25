export interface IXRContent {
  rendererPosMat: Array<number>;
  rendererUVMat: Array<number>;
  width: number;
  height: number;
  aspectRatio: number;
  projectionMatrix?: Array<number>;
  worldMatrix?: Array<number>;
  buffer?: ArrayBuffer;
}
