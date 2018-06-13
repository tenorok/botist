import { Botist } from './Botist';
import { IScene } from './MainScene';
export declare type DerivedScene = new (botist: Botist, back: () => void, next: () => void) => IScene;
export declare class Scenario {
    private scenes;
    private scenesInstances;
    constructor(scenes: DerivedScene[]);
    enter(botist: Botist, previousScene: IScene, next?: () => void): void;
    private createScene(botist, next?, sceneIndex?);
}
