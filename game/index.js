import { pxcan } from '../lib'
import { binds } from './binds';
import { worldview } from './gameloop';
import { pad } from '../lib/input/pad'

export default () => pxcan({ height: 60, width: 90 }, [pad(binds)], worldview()).fullscreen();
