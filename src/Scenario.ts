import { Botist } from './Botist';
import { IScene } from './MainScene';

export type DerivedScene = new (
    botist: Botist,
    back: () => void,
    next: () => void,
) => IScene;

export class Scenario {
    private scenesInstances: IScene[] = [];

    constructor(private scenes: DerivedScene[]) {}

    public enter(botist: Botist, previousScene: IScene, next?: () => void) {
        this.scenesInstances = []; // Create instances each time because `next` can be other.
        this.scenesInstances.push(previousScene);
        const firstScene = this.createScene(botist, next);
        if (firstScene) {
            botist.scene(firstScene);
        }
    }

    private createScene(botist: Botist, next?: () => void, sceneIndex: number = 0): IScene | null {
        if (typeof this.scenes[sceneIndex] === 'undefined') {
            return null;
        }

        const scene = new this.scenes[sceneIndex](botist, () => {
            botist.scene(this.scenesInstances[sceneIndex]);
        }, () => {
            const nextScene = this.createScene(botist, next, sceneIndex + 1);
            if (nextScene) {
                botist.scene(nextScene);
            } else if (typeof next === 'function') {
                next();
            }
        });

        this.scenesInstances.push(scene);
        return scene;
    }
}
