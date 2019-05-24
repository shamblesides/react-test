import { pxcan } from '../src/pxcan.js'
import { binds } from './binds.js';
import { worldview } from './gameloop.js';
import { pad } from '../src/input/pad.js'

export default () => pxcan({ height: 60, width: 90 }, [pad(binds)], worldview()).fullscreen();
