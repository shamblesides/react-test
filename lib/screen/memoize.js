const UNSET_VALUE = {};

export function memoize(fn) {
    let val = UNSET_VALUE;
    let map = null;

    return function(...args) {
        if (args.length === 0) {
            if (val === UNSET_VALUE) val = fn();
            return val;
        }

        map = map || new Map();

        const key = args[0];

        if (map.has(key)) {
            const m = map.get(key);
            return m(...args.slice(1));
        } else {
            const m = memoize(fn.bind(null, args[0]));
            map.set(key, m);
            return m(...args.slice(1));
        }
    }
}

export function memoizeBy(by, fn) {
    let val = UNSET_VALUE;
    let map = null;

    return function(...args) {
        if (by.length === 0) {
            if (val === UNSET_VALUE) val = fn(...args);
            return val;
        }

        map = map || new Map();

        const key = by[0](args);

        if (map.has(key)) {
            const m = map.get(key);
            return m(...args);
        } else {
            const m = memoizeBy(by.slice(1), fn);
            map.set(key, m);
            return m(...args);
        }
    }
}

