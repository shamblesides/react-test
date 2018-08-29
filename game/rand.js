//
// Custom random number generator
// It can be called as a function, or can be seeded
//


// Hashcode of strings.
//  http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
function hashString(str) {
    let hash = 0, i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

// get a seed value from a number or a string
function getInitialState(seed) {
    if (seed == null) return Math.random();
    if (typeof seed === 'number') return seed;
    if (typeof seed === 'string') return hashString(seed);
    throw new Error('not sure what to do with seed: ' + seed);
}

// generator that takes a seed and yields values 0 <= x < 1
function makeGenerator(seed) {
    let state = getInitialState(seed);
    return () => {
        const x = Math.sin(state++) * 10000;
        return x - Math.floor(x);
    };
}

function createRand(seed) {
    const gen = makeGenerator(seed);
    const obj = function(...args) {
        const x = gen();
        // float from 0 to <1
        if (args.length === 0) {
            return x;
        }
        // array index
        if (Array.isArray(args[0])) {
            const idx = Math.floor(x*args[0].length);
            return args[0][idx];
        }
        // int from 0 to <N
        if (args.length === 1) {
            return Math.floor(x*args[0]);
        }
        // int from A to B
        if (args.length === 2) {
            return Math.floor(x*(args[1]+1-args[0]))+args[0];
        }
        // unknown
        throw new Error('invalid arguments for random generator.');
    };
    obj.create = function(seed) {
        return createRand(seed == null ? gen() : seed);
    };
    return obj;
}

export const rand = createRand(null);
