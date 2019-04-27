import { game } from '../lib'
import { binds } from './binds';
import { gameloop } from './gameloop';
import { ROOM_HEIGHT as height, ROOM_WIDTH as width } from './rooms';

export default (stuff) => game({ binds, gameloop, height, width, ...stuff });
