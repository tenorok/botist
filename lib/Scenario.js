"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Scenario {
    constructor(scenes) {
        this.scenes = scenes;
        this.scenesInstances = [];
    }
    enter(botist, from, res, previousScene, next) {
        this.scenesInstances = []; // Create instances each time because `next` can be other.
        this.scenesInstances.push(previousScene);
        const firstScene = this.createScene(botist, from, res, next);
        if (firstScene) {
            botist.scene(from, res, firstScene);
        }
    }
    createScene(botist, from, res, next, sceneIndex = 0) {
        if (typeof this.scenes[sceneIndex] === 'undefined') {
            return null;
        }
        const scene = new this.scenes[sceneIndex](botist, () => {
            botist.scene(from, res, this.scenesInstances[sceneIndex]);
        }, () => {
            const nextScene = this.createScene(botist, from, res, next, sceneIndex + 1);
            if (nextScene) {
                botist.scene(from, res, nextScene);
            }
            else if (typeof next === 'function') {
                next();
            }
        }, () => {
            botist.mainScene(from, res);
        });
        this.scenesInstances.push(scene);
        return scene;
    }
}
exports.Scenario = Scenario;
//# sourceMappingURL=Scenario.js.map