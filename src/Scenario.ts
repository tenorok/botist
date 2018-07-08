import {
    Botist,
    IFrom,
} from './Botist';
import { IScene } from './MainScene';
import { ISceneConstructor } from './Scene';
import { Response } from './Response';

export class Scenario {
    private scenesInstances: IScene[] = [];

    constructor(private scenes: ISceneConstructor[]) {}

    public enter(botist: Botist, from: IFrom, res: Response, previousScene: IScene, next?: () => void) {
        this.scenesInstances = []; // Create instances each time because `next` can be other.
        this.scenesInstances.push(previousScene);
        const firstScene = this.createScene(botist, from, res, next);
        if (firstScene) {
            botist.scene(from, res, firstScene);
        }
    }

    private createScene(
        botist: Botist,
        from: IFrom,
        res: Response,
        next?: () => void,
        sceneIndex: number = 0,
    ): IScene | null {
        if (typeof this.scenes[sceneIndex] === 'undefined') {
            return null;
        }

        const scene = new this.scenes[sceneIndex](botist, () => {
            botist.scene(from, res, this.scenesInstances[sceneIndex]);
        }, () => {
            const nextScene = this.createScene(botist, from, res, next, sceneIndex + 1);
            if (nextScene) {
                botist.scene(from, res, nextScene);
            } else if (typeof next === 'function') {
                next();
            }
        }, () => {
            botist.mainScene(from, res);
        });

        this.scenesInstances.push(scene);
        return scene;
    }
}
