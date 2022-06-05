import { Vector2, Vector3 } from "@oasis-engine/math";
import { SpriteRenderer } from "./SpriteRenderer";

export class Simple {
  static updatePosition(positions: Vector3[], renderer: SpriteRenderer) {
    const spritePos = renderer.sprite.positions;
    const { modelMatrix } = renderer;
    for (let i = 0, n = positions.length; i < n; i++) {
      positions[i].setValue(spritePos[i].x, spritePos[i].y, 0).transformToVec3(modelMatrix);
    }
  }

  static updateUV(uv: Vector2[], renderer: SpriteRenderer) {
      
  }

  static updateDirtyFlag() {}
}
