import { game } from '../lib'
import { binds } from './binds';
import { worldview } from './gameloop';

export default (stuff) => game({ binds, gameloop: worldview(), height: 60, width: 90, ...stuff });
