"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Scenario {
    constructor(scenes) {
        this.scenes = scenes;
        this.scenesInstances = [];
    }
    enter(botist, previousScene, next) {
        this.scenesInstances = []; // Create instances each time because `next` can be other.
        this.scenesInstances.push(previousScene);
        const firstScene = this.createScene(botist, next);
        if (firstScene) {
            botist.scene(firstScene);
        }
    }
    createScene(botist, next, sceneIndex = 0) {
        if (typeof this.scenes[sceneIndex] === 'undefined') {
            return null;
        }
        const scene = new this.scenes[sceneIndex](botist, () => {
            botist.scene(this.scenesInstances[sceneIndex]);
        }, () => {
            const nextScene = this.createScene(botist, next, sceneIndex + 1);
            if (nextScene) {
                botist.scene(nextScene);
            }
            else if (typeof next === 'function') {
                next();
            }
        });
        this.scenesInstances.push(scene);
        return scene;
    }
}
exports.Scenario = Scenario;
//# sourceMappingURL=Scenario.js.map