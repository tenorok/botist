import { Botist } from './Botist';
import { Scene } from './Scene';

export type DerivedScene = new (
    botist: Botist,
    back: () => void,
    next: () => void,
) => Scene;

export class Scenario {
    constructor(private scenes: DerivedScene[]) {}

    public enter(botist: Botist) {
        botist.scene(new this.scenes[0](botist, () => {}, () => {}));
    }
}
