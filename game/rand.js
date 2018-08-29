/**
 * Custom random number generator
 * It can be called as a function, or can be seeded
 */


// Hashcode of strings.
//  http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
function hashString(str) {
    var hash = 0, i, chr, len;
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
    if(typeof seed === 'number') return seed;
    if(typeof seed === 'string') return hashString(seed);
    throw new Error('not sure what to do with seed: ' + seed);
}

// generator that takes a seed and yields values 0 <= x < 1
function makeGenerator(seed) {
    let state = getInitialState(seed);
    return () => {
        const x = Math.sin(state++) * 10000;
        return x - Math.floor(x);
    }
}

function createRand(seed) {
    const gen = makeGenerator(seed);
    const obj = function() {
        // console.log(arguments)
        const x = gen();
        // float from 0 to <1
        if (arguments.length === 0) {
            return x;
        }
        // array index
        if (Array.isArray(arguments[0])) {
            const idx = Math.floor(x*arguments[0].length);
            return arguments[0][idx];
        }
        // int from 0 to <N
        if (arguments.length === 1) {
            return Math.floor(x*arguments[0]);
        }
        // int from A to B
        if (arguments.length === 2) {
            return Math.floor(x*(arguments[1]+1-arguments[0]))+arguments[0];
        }
        // unknown
        else throw new Error('invalid arguments for random generator.');
    };
    obj.create = function(seed) {
        return createRand(seed == null ? gen() : seed);
    };
    return obj;
};

export const rand = createRand(null);
