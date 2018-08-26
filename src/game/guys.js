import guy from './guy';

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

/*
export function bird(guy) {
    guy.w = 8;
    guy.h = 8;
    guy.ya = 0.02;
    guy.yv = -0.4;
    guy.yvmax = 1;
    guy.xvmax = 1;
    guy.brain = function() {
        var b = {};
        if(player.x > this.x + 20) b.right = true;
        else if(player.x < this.x - 20) b.left = true;
        if(!player.isGrounded()) b.jump = true;
        return b;
    };
    guy.act = function(brain) {
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
    };
    guy.frame = function(clock) {
        return clock%10>=5 ? 11: 10;
    };
}

export function aquarium(guy) {
    guy.y = guy.rand(5,35);
    guy.xvmax = 0.5;
    switch(guy.rand(3)) {
        case 0:
        guy.w = 9;
        guy.h = 5;
        guy.xdrag = 0.01;
        guy.ya = 0;
        guy.firstFrame = 15;
        break;
        
        case 1:
        guy.w = 6;
        guy.h = 3;
        guy.xdrag = 0.025;
        guy.ya = 0;
        guy.firstFrame = 17;
        break;
        
        default:
        guy.w = 12;
        guy.h = 12;
        guy.xdrag = 0.01;
        guy.ya = -0.01;
        guy.firstFrame = 19;
        break;
    }
    guy.brain = function() {
        if(Math.abs(this.xv) <= this.xdrag) {
            if(this.x > 78) return { left: true };
            if(this.x < 10) return { right: true };
            if(this.flip === 'h') return { left: true };
            return { right: true };
        }
        return {};
    };
    guy.act = function(brain) {
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
    };
    guy.frame = function() {
        return this.firstFrame + (Math.abs(this.xv) < 0.15? 1: 0);
    };
}

export function rock(guy) {
    guy.w = 12;
    guy.h = 7;
    guy.y = guy.ground().height - 30;
    guy.xfric = 0;
    guy.brain = function() {
        if(this.isGrounded() && guy.rand()<.01) {
            if(this.x > player.x) return { left: true };
            else return { right: true };
        }
        return {};
    };
    guy.act = function(brain) {
        if(this.isGrounded()) {
            if(brain.left) { this.flip = 'h'; this.xv = -0.1; }
            if(brain.right) { this.flip = ''; this.xv = 0.1; }
        }
    };
    guy.frame = function(clock) {
        if(!this.isGrounded()) return 13;
        return clock%80>=60 && this.xv ? 12: 13;
    };
}

export function spinner(guy) {
    guy.w = 9;
    guy.h = 9;
    guy.xdrag = 0;
    guy.xfric = 0;
    guy.ya = 0;
    guy.y = guy.ground().height - 15;
    guy.mode = 0;
    guy.waitCounter = 10;
    var dir = null;
    guy.brain = function() {
        if (this.rand()<0.03) {
            dir = this.rand(['jump','left','right']);
        }
        var b = {};
        b[dir] = true;
        return b;
    };
    guy.act = function(brain) {
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
    };
    guy.frame = function() {
        if(this.mode === 0 || this.mode === 4) return 21;
        if(this.mode === 2 || this.mode === 6) return 23;
        return 22;
    };
}

*/

export const guyTypes = [
    froge
    // bird,
    // aquarium,
    // rock,
    // spinner
];