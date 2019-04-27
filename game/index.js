import { game } from '../lib'
import { binds } from './binds';
import { gameloop } from './gameloop';
import { ROOM_HEIGHT as height, ROOM_WIDTH as width } from './rooms';
const backgroundColor = '#45283c';

export default (stuff) => game({ binds, gameloop, height, width, backgroundColor, ...stuff });
