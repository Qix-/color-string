export type Model = 'rgb' | 'hsl' | 'hwb';

export type Value = number[] | undefined;

export type Get = {
	(color: string): {model: Model; value: Value};
	rgb: (color: string) => Value;
	hsl: (color: string) => Value;
	hwb: (color: string) => Value;
};

export type To = {
	hex: (color: string) => string;
	rgb: (color: string) => string;
	keyword: (color: string) => string;
	hsl: (color: string) => string;
	hwb: (color: string) => string;
};
