import { froge } from './guys';
import { rand } from './rand';

export function createPlayer(world) {
    const color = '#' + (Math.random() * (2**24) | 0).toString(16);
    console.log(color);
    const player = froge({ roomNum: 0, x: 20, rand: rand.create(505), world, colors: [color] });
    player.world.player = player;
    return player;
}
