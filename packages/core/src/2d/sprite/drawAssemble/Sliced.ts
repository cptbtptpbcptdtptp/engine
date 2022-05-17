import { Vector2, Vector3 } from "@oasis-engine/math";
import { Sprite } from "../..";

export class Sliced {
  private useLength: number = 0;
  private positions: Vector3[];
  private uvs: Vector2[];
  update(width: number, height: number, sprite: Sprite): void {
    let useLength = 0;
    if (width !== 0 && height !== 0) {
      const { positions, uvs } = this;
      const { texture, atlasRegion, pixelsPerUnit, border } = sprite;
      // TextureSize
      let textureW: number, textureH: number;
      textureW = (texture.width * atlasRegion.width) / pixelsPerUnit;
      textureH = (texture.height * atlasRegion.height) / pixelsPerUnit;
      // 上 左 右 下
      const borderTop = textureH * border.x;
      const borderLeft = textureW * border.y;
      const borderRight = textureW * border.z;
      const borderBottom = textureH * border.w;
      let arrRow: number[], arrCol: number[];
      if (width > borderLeft + borderRight) {
        arrRow = [0, borderLeft, width - borderRight, width];
      } else {
        arrRow = [
          0,
          (width * borderLeft) / (borderLeft + borderRight),
          (width * borderLeft) / (borderLeft + borderRight),
          width
        ];
      }
      if (height > borderTop + borderBottom) {
        arrCol = [0, borderTop, height - borderBottom, height];
      } else {
        arrCol = [
          0,
          (height * borderTop) / (borderTop + borderBottom),
          (height * borderTop) / (borderTop + borderBottom),
          height
        ];
      }

      for (let i = 0; i < 4; i++) {
        if (i + 1 < 4 && arrRow[i + 1] == arrRow[i]) {
          continue;
        }
        for (let j = 0; j < 4; j++) {
          if (j + 1 < 4 && arrCol[j + 1] == arrCol[i]) {
            continue;
          }
          positions[useLength].setValue(arrRow[i], arrCol[i], 0);
          sprite.getSlicedUV(i, j).cloneTo(uvs[useLength]);
          ++useLength;
        }
      }
    }
    this.useLength = useLength;
  }
}
