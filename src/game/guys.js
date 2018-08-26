import guy from './guy';
import { player } from './player';
import { ROOM_WIDTH } from './rooms';

export const froge = (ops) => ({
    ...guy(ops),
    w: 12,
    h: 12,
    y: 20,
    xv: 1,
    yv: -0.5,
    state: 'standing',
    brain: (() => {
        let dir = 0;
        return function() {
            if (this.rand()<0.05) dir = this.rand(-1,1);
            return {
                left: (dir === -1),
                right: (dir === 1),
                jump: (this.rand()<0.005)
            }
        }
    })(),
    act(brain) {
        if(brain.left) { this.xa = -1; this.flip = 'h'; }
        else if(brain.right) { this.xa = 1; this.flip = ''; }
        else this.xa = 0;
        if(brain.jump && this.isGrounded() && this.state === 'standing')
            this.yv = -2.5;
    },
    frame(clock) {
        if(!this.isGrounded()) return 3;
        else if(this.xa === 0) return this.rand() < .1? 1: 0;
        else return clock%10>=5 ? 2: 0;
    },
});

export const bird = (ops) => ({
    ...guy(ops),
    w: 8,
    h: 8,
    ya: 0.02,
    yv: -0.4,
    yvmax: 1,
    xvmax: 1,
    brain() {
        return {
            left: (player.x < this.x - 20),
            right: (player.x > this.x + 20),
            jump: (!player.isGrounded()),
        };
    },
    act(brain) {
        if(brain.right) {
            this.xa = 0.8;
            this.flip = '';
        }
        else if(brain.left) {
            this.xa = -0.8;
            this.flip = 'h';
        }
        else this.xa = 0;
        if(this.isGrounded() && brain.jump) {
            this.yv = -1;
        }
    },
    frame: (clock) => clock%10>=5 ? 11: 10,
});

export const aquarium = (ops) => ({
    ...guy(ops),
    y: ops.rand(5,35),
    xvmax: 0.5,
    ...(ops.rand([
        {
            w: 9,
            h: 5,
            xdrag: 0.01,
            ya: 0,
            firstFrame: 15,
        },
        {
            w: 6,
            h: 3,
            xdrag: 0.025,
            ya: 0,
            firstFrame: 17,
        },
        {
            w: 12,
            h: 12,
            xdrag: 0.01,
            ya: -0.01,
            firstFrame: 19,
        },
    ])),
    brain() {
        if(Math.abs(this.xv) <= this.xdrag) {
            if(this.x > ROOM_WIDTH - 10) return { left: true };
            if(this.x < 10) return { right: true };
            if(this.flip === 'h') return { left: true };
            return { right: true };
        }
        return {};
    },
    act(brain) {
        if(Math.abs(this.xv) <= this.xdrag) {
            if(brain.left) {
                this.flip = 'h';
                this.xv = -this.xvmax;
            }
            else if(brain.right) {
                this.flip = '';
                this.xv = this.xvmax;
            }
        }
        if(this.ya) {
            if(this.y < 15) this.ya = Math.abs(this.ya);
            else this.ya = -Math.abs(this.ya);
        }
    },
    frame() {
        return this.firstFrame + (Math.abs(this.xv) < 0.15? 1: 0);
    },
});

export const rock = (ops) => ({
    ...guy(ops),
    w: 12,
    h: 6,
    y: 0, //guy.ground().height - 30,
    xfric: 0,
    brain() {
        if(this.isGrounded() && this.rand()<.01) {
            if(this.x > player.x) return { left: true };
            else return { right: true };
        }
        return {};
    },
    act(brain) {
        if(this.isGrounded()) {
            if(brain.left) { this.flip = 'h'; this.xv = -0.1; }
            if(brain.right) { this.flip = ''; this.xv = 0.1; }
        }
    },
    frame(clock) {
        if(!this.isGrounded()) return 13;
        return clock%80>=60 && this.xv ? 12: 13;
    },
});

export const spinner = (ops) => ({
    ...guy(ops),
    w: 9,
    h: 9,
    xdrag: 0,
    xfric: 0,
    ya: 0,
    y: 15, //guy.ground().height - 15,
    mode: 0,
    waitCounter: 10,
    brain: (() => {
        let dir = null;
        return function() {
            if (this.rand()<0.03) {
                dir = this.rand(['jump','left','right']);
            }
            return { [dir]: true };
        }
    })(),
    act(brain) {
        if(this.waitCounter > 0) {
            --this.waitCounter;
            return;
        }
        if(this.mode === 0 && brain.jump) this.yv = -1;
        else if(this.mode === 2 && brain.right) this.xv = 1;
        else if(this.mode === 6 && brain.left) this.xv = -1;
        else {
            this.xv = 0;
            this.yv = 0;
            ++this.mode;
            if(this.mode >= 8) this.mode = 0;
            this.flip = (this.mode%4 === 3)? 'h': '';
            this.waitCounter = 10;
        }
    },
    frame() {
        if(this.mode === 0 || this.mode === 4) return 21;
        if(this.mode === 2 || this.mode === 6) return 23;
        return 22;
    },
});

export const guyTypes = [
    froge,
    bird,
    aquarium,
    rock,
    spinner,
];