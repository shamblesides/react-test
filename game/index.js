import { game } from '../lib'
import { binds } from './binds';
import { worldview } from './gameloop';
import { ROOM_HEIGHT as height, ROOM_WIDTH as width } from './rooms';

export default (stuff) => game({ binds, gameloop: worldview(), height, width, ...stuff });
