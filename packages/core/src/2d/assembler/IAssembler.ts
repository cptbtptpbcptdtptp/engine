import { BoundingBox, Color, Matrix, Vector2 } from "@galacean/engine-math";
import { Renderer } from "../../Renderer";
import { Sprite } from "../sprite";
import { MBChunk } from "../../RenderPipeline/batcher/MeshBuffer";

/**
 * @internal
 */
export interface IAssembler {
  resetData(renderer: Renderer, vCount?: number, iCount?: number): void;
  updatePositions(
    sprite: Sprite,
    width: number,
    height: number,
    pivot: Vector2,
    matrix: Matrix,
    chunk: MBChunk,
    bounds: BoundingBox,
    flipX?: boolean,
    flipY?: boolean
  ): void;
  updateUVs?(sprite: Sprite, chunk: MBChunk): void;
  updateColor?(chunk: MBChunk, color: Color): void;
}
