declare function memoize<A,B>(by: (...args: A) => any, fn: (...args: A) => B): (...args: A) => B
export default memoize;

export declare function byArg0<A>(by: (arg0: A) => A)
