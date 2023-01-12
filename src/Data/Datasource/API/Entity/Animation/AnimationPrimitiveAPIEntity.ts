import {LineToAnimation} from "../../../../../Domain/Models/Animation/Prebuilt/LineToAnimation";
import {BezierToAnimation} from "../../../../../Domain/Models/Animation/Prebuilt/BezierToAnimation";
import {AnimationComposition} from "../../../../../Domain/Models/Animation/Prebuilt/AnimationComposition";
import {SemiCircleToAnimation} from "../../../../../Domain/Models/Animation/Prebuilt/SemiCircleToAnimation";
import {WaitAnimation} from "../../../../../Domain/Models/Animation/Prebuilt/WaitAnimation";

export interface AnimationPrimitiveAPIEntity {
    type: AnimationPrimitiveSubtype,
}

export type AnimationPrimitiveSubtype = 'Bezier' | 'Line' | 'Wait' | 'Composed' | 'Semicircle'

export function fromApi<T extends AnimationPrimitiveAPIEntity>(a: T) {
    const b = a as any;
    switch (a.type) {
        case "Line": { return new LineToAnimation( b.relative, b.position, b.timeSec ); }
        case "Bezier": { return new BezierToAnimation(b.relative, b.endPosition, b.anchorPoints, b.timeSec); }
        case "Composed": { return new AnimationComposition(b.animations.map((a: AnimationPrimitiveAPIEntity) => fromApi(a))); }
        case "Semicircle": { return new SemiCircleToAnimation(b.relative, b.timeSec, b.endPosition, b.angleDeg, b.circleDirection); }
        case "Wait": { return new WaitAnimation(b.timeSec); }
    }
}