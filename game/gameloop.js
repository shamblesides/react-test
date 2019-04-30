import { ROOM_WIDTH, ROOM_HEIGHT } from './rooms';
import { createPlayer } from './player';
import { rand as rootRand } from './rand';
import { multi, letters } from '../lib';
import px6 from '../lib/fonts/px6';

export function worldview() {
    const player = createPlayer({ rooms: new Map(), clock: 0, rand: rootRand.create(305) });

    const helloFrog = letters(px6, 'hello frog').single().at(1, 0);

    return function gameloop({ buttons }) {
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
            if (player.roomNum !== 0) {
                --player.roomNum;
                player.x = ROOM_WIDTH - 2;
            }
        }

        // main game panel
        const pane = multi(ROOM_WIDTH, ROOM_HEIGHT, [
            player.room().sprites,
            player.sprite(),
            ...player.room().guys.map(guy => guy.sprite()),
        ]).at(1, 6);

        // increment clock
        ++player.world.clock;

        // give sprites
        return { sprites: [pane, helloFrog] };
    };
};
