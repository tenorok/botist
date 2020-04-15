import { Botist, IFrom } from './Botist';
import { IScene } from './MainScene';
import { ISceneConstructor } from './Scene';
import { Response } from './Response';
export declare class Scenario {
    private scenes;
    private scenesInstances;
    constructor(scenes: ISceneConstructor[]);
    enter(botist: Botist, from: IFrom, res: Response, previousScene: IScene, next?: () => void): void;
    private createScene;
}
