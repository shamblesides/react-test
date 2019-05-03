import { pxcan } from '../lib'
import mount from '../lib/mount-fullscreen';
import { binds } from './binds';
import { worldview } from './gameloop';
import { pad } from '../lib/input/pad'

export default () => mount(
    pxcan({ height: 60, width: 90 }, [pad(binds)], worldview())
);
