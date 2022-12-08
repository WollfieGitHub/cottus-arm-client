
export default class Color {
    public static readonly Red: Color = new Color(255, 0, 0, 255);
    public static readonly Green: Color = new Color(0, 255, 0, 255);
    public static readonly Blue: Color = new Color(0, 0, 255, 255);
    
    private static readonly ColorShiftFactor = 0.1;
    
    private readonly r: number;
    private readonly g: number;
    private readonly b: number;
    private readonly a: number;
    
    constructor(r: number, g: number, b: number, a: number = 255) {
        this.r = r; this.g = g; this.b = b; this.a = a;
    }

    /**
     * Create a new color from hsl parameters
     * @param h The Hue of the color in degrees, [0, 360]
     * @param s The Saturation of the color, [0, 1]
     * @param l The Lightness of the color, [0, 1]
     * 
     * from: https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
     */
    public static fromHsl(h: number, s: number, l: number): Color {
        const a = s * Math.min(l, 1 - l);
        const f = (n: number): number => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color);   // convert to Hex and prefix "0" if needed
        };
        return new Color(f(0), f(8), f(4));
    }

    public toRgbString(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
    }

    /**
     * Return a darker color by the specified color
     * @param factor The resulting color will be {@code factor} times darker
     */
    public darker(factor: number = Color.ColorShiftFactor): Color {
        return new Color(
            Math.max((1-factor) * this.r, 0),
            Math.max((1-factor) * this.g, 0),
            Math.max((1-factor) * this.b, 0), 
            this.a
        )
    }

    /**
     * Return a brighter color by the specified color
     * @param factor The resulting color will be {@code factor} times brighter
     */
    public brighter(factor: number = Color.ColorShiftFactor): Color {
        return new Color(
            Math.min((1+factor) * this.r, 255),
            Math.min((1+factor) * this.g, 255),
            Math.min((1+factor) * this.b, 255),
            this.a
        )
    }
    
}