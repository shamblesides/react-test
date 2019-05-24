import test from 'ava';
import { pxcan } from '../pxcan.js';

const nullLoop = () => ({ gameloop: null });

test('create pxcan', t => {
    const { canvas } = pxcan({ width: 40, height: 40 }, [], nullLoop);
    t.is(canvas instanceof HTMLCanvasElement, true);
});
