import { game } from '../lib'
import mountFullscreen from '../lib/mount-fullscreen';
import { binds } from './binds';
import { worldview } from './gameloop';
import { pad } from '../lib/attach/pad'

export default () => mountFullscreen(
    game({ height: 60, width: 90 }, [pad(binds)], worldview())
);
