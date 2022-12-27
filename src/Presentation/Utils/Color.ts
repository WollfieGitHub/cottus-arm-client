
export default class Color {
    public static readonly Red: Color = new Color(255, 0, 0);
    public static readonly Green: Color = new Color(0, 255, 0);
    public static readonly Blue: Color = new Color(0, 0, 255);
    
    /** The color will shift by 20% lightness by default */
    private static readonly ColorShiftFactor = 0.05*100;
    
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
     * @param s The Saturation of the color, [0, 100]
     * @param l The Lightness of the color, [0, 100]
     * @param alpha The alpha factor of the color [0, 255]
     * 
     * from: https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
     */
    public static fromHsl(h: number, s: number, l: number, alpha: number = 255): Color {
        s /= 100;
        l /= 100;
        const k = (n:number) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = (n:number) =>
            l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        const [ r, g, b] = [255 * f(0), 255 * f(8), 255 * f(4)];

        return new Color(
            Math.round(r),
            Math.round(g),
            Math.round(b),
            alpha
        );
    }

    /**
     * Converts the current color to hue, saturation, lightness values
     */
    public toHsl(): {h: number, s: number, l:number} {
        // Make r, g, and b fractions of 1
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;

        // Find greatest and smallest channel values
        let cmin = Math.min(r,g,b),
            cmax = Math.max(r,g,b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        // Calculate hue
        // No difference
        if (delta === 0)
            h = 0;
        // Red is max
        else if (cmax === r)
            h = ((g - b) / delta) % 6;
        // Green is max
        else if (cmax === g)
            h = (b - r) / delta + 2;
        // Blue is max
        else
            h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        // Make negative hues positive behind 360°
        if (h < 0)
            h += 360;

        // Calculate lightness
        l = (cmax + cmin) / 2;

        // Calculate saturation
        s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

        // Multiply l and s by 100
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);
        
        return {h, s, l};
    }

    public toRgbString(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
    }

    /**
     * Return a darker color by the specified color
     * @param deltaL The resulting color will be {@code factor} times darker
     */
    public darker(deltaL: number = Color.ColorShiftFactor): Color {
        const { h, s, l } = this.toHsl();

        return Color.fromHsl( h, s, Math.max(l-deltaL, 0), this.a )
    }

    /**
     * Return a brighter color by the specified color
     * @param deltaL The resulting color will be {@code factor} times brighter
     */
    public brighter(deltaL: number = Color.ColorShiftFactor): Color {
        const { h, s, l } = this.toHsl();
        
        return Color.fromHsl( h, s, Math.min(l+deltaL, 100), this.a )
    }

    /**
     * Changes the saturation of the color to be the specified color
     * @param sat The saturation of the new color returned
     */
    public withSaturation(sat: number): Color {
        const { h, l } = this.toHsl();

        return Color.fromHsl( h, Math.min(Math.max(sat, 0), 100), l, this.a )
    }

    /**
     * Return a grey color with the specified level
     * @param level The level of grey for the color
     */
    static greyFrom(level: number) {
        return new Color(level, level, level);
    }
}