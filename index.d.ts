export type Model = 'rgb' | 'hsl' | 'hwb';

export type ColorString = {
	get: {
		(color: string): {model: Model; value: number[]} | undefined;
		rgb: (color: string) => number[] | undefined;
		hsl: (color: string) => number[] | undefined;
		hwb: (color: string) => number[] | undefined;
	};
	to: {
		hex: (r: number, g: number, b: number, a?: number) => string | undefined;
		rgb: {
			(r: number, g: number, b: number, a?: number): string | undefined;
			percent: (r: number, g: number, b: number, a?: number) => string | undefined;
		};
		keyword: (r: number, g: number, b: number, a?: number) => string | undefined;
		hsl: (h: number, s: number, l: number, a?: number) => string | undefined;
		hwb: (h: number, w: number, b: number, a?: number) => string | undefined;
	};
};

declare const colorString: ColorString;
export default colorString;
