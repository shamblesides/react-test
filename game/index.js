import { game } from '../lib'
import mountFullscreen from '../lib/mount-fullscreen';
import { binds } from './binds';
import { worldview } from './gameloop';

export default () => mountFullscreen(
    game({ binds, gameloop: worldview(), height: 60, width: 90 })
);
