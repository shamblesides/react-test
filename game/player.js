import { froge } from './guys';
import { rand } from './rand';

export function createPlayer(world) {
    const player = froge({ roomNum: 0, x: 20, rand: rand.create(505), world });
    player.world.player = player;
    return player;
}
