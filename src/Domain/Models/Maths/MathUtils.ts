
export function toDegrees(rad: number): number { return rad / Math.PI * 180; }

/** @return The normalized angle between ]-pi, pi] */
export function normalizedAngle(v: number) {
    const b = Math.PI * 2;
    return ((((v + Math.PI) % b) + b) % b) - Math.PI;
}

/**
 * Newton Rhapson method to minimize a function within a specified tolerance to 0
 * @param f The function to minimize
 * @param df The function's derivative
 * @param x0 The intial guess
 * @param dE The maximum error to 0
 * @param maxIter Maximum number of iterations
 */
export function newtonRhapson(
    f: (x: number) => number, df: (x: number) => number,
    x0: number, dE: number, maxIter?: number
) {
    if (maxIter === undefined) { maxIter = Number.MAX_VALUE; }
    
    let x: number = x0;
    let iter: number = 0;
    while (f(x) > dE && iter < maxIter) { 
        x = x - f(x)/df(x);
        iter++;
    }
    return x;
}