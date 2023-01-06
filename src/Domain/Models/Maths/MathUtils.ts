
export function toDegrees(rad: number): number { return rad / Math.PI * 180; }

/** @return The normalized angle between ]-pi, pi] */
export function normalizedAngle(v: number) {
    const b = Math.PI * 2;
    return ((((v + Math.PI) % b) + b) % b) - Math.PI;
}