import {
    Botist,
    IFrom,
} from './Botist';
import { IScene } from './MainScene';
import { ISceneConstructor } from './Scene';
import { Response } from './Response';
import { IEvent } from './Events/Event';
import {
    StartEvent,
    BackEvent,
    NextEvent,
    ExitEvent,
} from './Events/SceneEvents';

export class Scenario {
    private scenesInstances: IScene[] = [];

    constructor(private scenes: ISceneConstructor[]) {}

    public enter(botist: Botist, from: IFrom, res: Response, previousScene: IScene, next?: () => void) {
        this.scenesInstances = []; // Create instances each time because `next` can be other.
        this.scenesInstances.push(previousScene);
        const firstScene = this.createScene(botist, from, res, next);
        if (firstScene) {
            botist.scene(from, res, new StartEvent(), firstScene);
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

        const scene = new this.scenes[sceneIndex](botist, (event: IEvent = new BackEvent()) => {
            botist.scene(from, res, event, this.scenesInstances[sceneIndex]);
        }, (event: IEvent = new NextEvent()) => {
            const nextScene = this.createScene(botist, from, res, next, sceneIndex + 1);
            if (nextScene) {
                botist.scene(from, res, event, nextScene);
            } else if (typeof next === 'function') {
                next();
            }
        }, (event: IEvent = new ExitEvent()) => {
            botist.mainScene(from, res, event);
        });

        this.scenesInstances.push(scene);
        return scene;
    }
}
