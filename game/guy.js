import { getRoom, GROUND_WIDTH, ROOM_WIDTH } from './rooms';
import { mid, clamp } from './math';
import guysPng from './sprites/guys.png';
import {sprite} from '../lib/gfx/sprite';
import {recolor} from '../lib/transform/recolor';
import {flip} from '../lib/transform/flip';

const guysSheet = {
    src: guysPng,
    spriteWidth: 16,
    spriteHeight: 16,
    originX: 8,
    originY: 8,
};

const nextId = (function() {
    let i = 0;
    return () => `guy${i++}`;
}());

const base = {
    world: null,
    roomNum: null,
    w: 12,
    h: 12,
    x: null,
    y: 20,
    xv: 0,
    yv: 0,
    xa: 0,
    ya: 0.15,
    xfric: 0.5,
    xdrag: 0.1,
    xvmax: 2,
    yvmax: 4,
    flip: '',
    colors: null,
    // behavior
    brain: () => ({}),
    act: () => undefined,
    frame: () => 0,
    // methods
    left() { return this.x - this.w/2; },
    right() { return this.x + this.w/2; },
    top() { return this.y - this.h/2; },
    bottom() { return this.y + this.h/2; },
    room() { return getRoom(this.world, this.roomNum); },
    groundIndex() { return Math.floor(this.x / GROUND_WIDTH); },
    ground() { return this.room().ground[this.groundIndex()]; },
    isGrounded() { return this.ground().height === this.bottom(); },
    clock() { return this.world.clock; },
    move() {
        // velocity
        this.xv += this.xa;
        const xslow = this.isGrounded()? this.xfric: this.xdrag;
        this.xv = mid(0, this.xv, this.xv-(xslow*Math.sign(this.xv)));
        this.xv = clamp(this.xv, this.xvmax);
        this.yv = Math.max(this.yv + this.ya, -this.yvmax);
        // move x
        const oldx = this.x;
        const wasg = this.isGrounded();
        this.x = mid(this.x + this.xv, 0, ROOM_WIDTH - 1);
        const newg = this.ground();
        if (newg.height < this.bottom() - 3) { this.x = oldx; this.xv = 0; }
        // move y
        this.y = Math.max(this.y + this.yv, 0);
        if (wasg && this.yv > 0 && this.bottom() > this.ground().height - 3) {
            this.y = this.ground().height - this.h/2;
            this.yv = 0;
        }
        else if (this.yv > 0 && this.bottom() > this.ground().height) {
            this.y = this.ground().height - this.h/2;
            this.yv = 0;
        }
    },
    sprite() {
        const transforms = [];
        if (this.flip) transforms.push(flip(this.flip));
        if (this.colors) transforms.push(recolor(this.colors));
        return sprite(guysSheet, this.frame(this.clock()), ...transforms).at(this.x, this.y)
    },
};

export function guy(froge) {
    return (overrides) => {
        if (overrides.x == null) throw new Error('Missing guy param: x');
        if (overrides.roomNum == null) throw new Error('Missing guy param: roomNum');
        if (overrides.rand == null) throw new Error('Missing guy param: rand');
        if (overrides.world == null) throw new Error('Missing guy param: world');

        const skeleton = {
            ...base,
            id: nextId(),
            ...overrides,
        };
        return {
            ...skeleton,
            ...froge(skeleton),
            ...overrides,
        };
    };
}
