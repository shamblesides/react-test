import { ROOM_WIDTH } from './rooms';
import { createPlayer } from './player';
import { rand as rootRand } from './rand';

export function gameloop({ pad, player=null }) {
    const buttons = pad.next();

    // is player defined
    if (!player) {
        player = createPlayer({ rooms: new Map(), clock: 0, rand: rootRand.create(305) });
    }
    // is his world defined
    if (!player.world) {
        player.world = {
            player,
            rooms: [],
            clock: 0,
        };
    }

    // let everything move like itself
    // const playerBrain = {
    //     left: buttons.left.pressed,
    //     right: buttons.right.pressed,
    //     up: buttons.up.pressed,
    //     down: buttons.down.pressed,
    // };
    player.act(player.brain());
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
        if (player.roomNum !== 0) {
            --player.roomNum;
            player.x = ROOM_WIDTH - 2;
        }
    }

    // drawing
    const sprites = [
        player.room().sprites,
        player.sprite(),
        ...player.room().guys.map(guy => guy.sprite()),
    ];

    // increment clock
    ++player.world.clock;

    // give sprites
    return { player, sprites };
}
