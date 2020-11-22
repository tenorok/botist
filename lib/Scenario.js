"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SceneEvents_1 = require("./Events/SceneEvents");
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
            botist.scene(from, res, new SceneEvents_1.StartEvent(), firstScene);
        }
    }
    createScene(botist, from, res, next, sceneIndex = 0) {
        if (typeof this.scenes[sceneIndex] === 'undefined') {
            return null;
        }
        const scene = new this.scenes[sceneIndex](botist, (event = new SceneEvents_1.BackEvent()) => {
            botist.scene(from, res, event, this.scenesInstances[sceneIndex]);
        }, (event = new SceneEvents_1.NextEvent()) => {
            const nextScene = this.createScene(botist, from, res, next, sceneIndex + 1);
            if (nextScene) {
                botist.scene(from, res, event, nextScene);
            }
            else if (typeof next === 'function') {
                next();
            }
        }, (event = new SceneEvents_1.ExitEvent()) => {
            botist.mainScene(from, res, event);
        });
        this.scenesInstances.push(scene);
        return scene;
    }
}
exports.Scenario = Scenario;
//# sourceMappingURL=Scenario.js.map