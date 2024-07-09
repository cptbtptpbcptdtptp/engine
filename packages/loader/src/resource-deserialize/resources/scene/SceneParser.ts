import { Engine, Scene } from "@galacean/engine-core";
import HierarchyParser from "../parser/HierarchyParser";
import type { IScene } from "../schema";
import { SceneParserContext } from "./SceneParserContext";

/** @Internal */
export class SceneParser extends HierarchyParser<Scene, SceneParserContext> {
  /**
   * Parse scene data.
   * @param engine - the engine of the parser context
   * @param sceneData - scene data which is exported by editor
   * @returns a promise of scene
   */
  static parse(engine: Engine, sceneData: IScene): Promise<SceneParserContext> {
    const scene = new Scene(engine);
    const context = new SceneParserContext(sceneData, engine, scene);
    const parser = new SceneParser(context);
    parser.start();
    return parser.promise.then(() => context);
  }

  protected override handleRootEntity(id: string): void {
    const { target, entityMap } = this.context;
    target.addRootEntity(entityMap.get(id));
  }
}
