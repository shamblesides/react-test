export default function memoize(by, fn) {
    const map = new Map();
    return function(...args) {
        const key = by(...args);
        if (map.has(key)) {
            return map.get(key);
        } else {
            const result = fn(...args);
            map.set(key, result)
            return result;
        }
    }
}

export function byArg0(arg0) {
    return arg0;
}
