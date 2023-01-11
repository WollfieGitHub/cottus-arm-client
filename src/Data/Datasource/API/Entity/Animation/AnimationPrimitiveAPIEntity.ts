
export interface AnimationPrimitiveAPIEntity {
    type: AnimationPrimitiveSubtype,
}

export type AnimationPrimitiveSubtype = 'Bezier' | 'Line' | 'Wait' | 'Composed' | 'Semicircle'