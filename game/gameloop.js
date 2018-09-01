import { player } from './player';
import { ROOM_WIDTH } from './rooms';

let clock = 0;

export function gameloop({ pad }) {
    const buttons = pad.next();

    // let everything move like itself
    const playerBrain = {
        left: buttons.left.pressed,
        right: buttons.right.pressed,
        up: buttons.up.pressed,
        down: buttons.down.pressed,
    };
    player.act(playerBrain);
    player.move();

    player.room().guys.forEach(guy => {
        const brain = guy.brain();
        guy.act(brain);
        guy.move();
    });

    // next room?
    if (player.x === ROOM_WIDTH - 1) {
        ++player.roomNum;
        player.x = 1;
    }
    // previous room??
    else if (player.x === 0) {
        if (player.prevRoom()) {
            --player.roomNum;
            player.x = ROOM_WIDTH - 2;
        }
    }

    // drawing
    const sprites = [
        ...player.room().sprites,
        ...[player, ...player.room().guys].map(guy => guy.sprite(clock)),
    ];

    // increment clock
    ++clock;

    // give sprites
    return { sprites };
}
