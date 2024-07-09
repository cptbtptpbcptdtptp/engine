import { Engine } from "@galacean/engine-core";
import { SceneParserContext } from "../scene/SceneParserContext";
import { IScene } from "../schema";

export abstract class CustomParser {
  onSceneParse(engine: Engine, context: SceneParserContext, data: IScene): Promise<void> {
    return Promise.resolve();
  }
}
