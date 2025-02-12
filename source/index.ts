import colorNames from 'color-name';

const reversedColorNames = Object.fromEntries(Object.entries(colorNames).map(([k, v]) => [v.join(','), k]));

const clamp = (number_: number, min: number, max: number) => Math.min(Math.max(min, number_), max);

export const rgbClamp = (number_: number) => clamp(number_, 0, 255);

export const alphaClamp = (number_: number) => clamp(number_, 0, 1);

export const hueClamp = (number_: number) => ((number_ % 360) + 360) % 360;

export const percentClamp = (number_: number) => clamp(number_, 0, 100);

const hexDouble = (number_: number) => {
	const string_ = Math.round(Math.max(0, number_)).toString(16).toUpperCase();
	return (string_.length < 2) ? '0' + string_ : string_;
};

const normalizeRgba = (rgba: number[]) => rgba.map((x, i) => i < 3 ? rgbClamp(x) : alphaClamp(x));

// eslint-disable-next-line complexity
export const getRgb = (rgbString: string) => {
	if (!rgbString) {
		return undefined;
	}

	const abbrPattern = /^#(?<rgba>[a-f\d]{3,4})$/i;
	const hexPattern = /^#(?<rrggbb>[a-f\d]{6})(?<alpha>[a-f\d]{2})?$/i;
	const rgbaPattern = /^rgba?\(\s*(?<r>[+-]?\d+)(?=[\s,])\s*(?:,\s*)?(?<g>[+-]?\d+)(?=[\s,])\s*(?:,\s*)?(?<b>[+-]?\d+)\s*(?:[,|/]\s*(?<a>[+-]?[\d.]+)(?<p>%?)\s*)?\)$/;
	const perPattern = /^rgba?\(\s*(?<r>[+-]?[\d.]+)%\s*,?\s*(?<g>[+-]?[\d.]+)%\s*,?\s*(?<b>[+-]?[\d.]+)%\s*(?:[,|/]\s*(?<a>[+-]?[\d.]+)(?<p>%?)\s*)?\)$/;
	const keywordPattern = /^(?<keyword>\w+)$/;

	const hexMatch = hexPattern.exec(rgbString);
	if (hexMatch) {
		const rrggbb = hexMatch.groups?.['rrggbb'];
		const hexAlpha = hexMatch.groups?.['alpha'];
		/* c8 ignore start */
		if (!rrggbb) {
			return undefined;
		}
		/* c8 ignore stop */

		const rgb = [0, 0, 0, 1];

		for (let i = 0; i < 3; i++) {
			const i2 = i * 2;
			rgb[i] = Number.parseInt(rrggbb.slice(i2, i2 + 2), 16);
		}

		if (hexAlpha) {
			rgb[3] = Number.parseInt(hexAlpha, 16) / 255;
		}

		return rgb;
	}

	const abbrMatch = abbrPattern.exec(rgbString);
	if (abbrMatch) {
		const rgba = abbrMatch.groups?.['rgba'];
		/* c8 ignore start */
		if (!rgba) {
			return undefined;
		}
		/* c8 ignore stop */

		return normalizeRgba([...rgba.padEnd(4, 'F')].map((x, i) => Number.parseInt(x + x, 16) / (i < 3 ? 1 : 255)));
	}

	const rgbaMatch = rgbaPattern.exec(rgbString);
	if (rgbaMatch) {
		const {r, g, b, a, p} = rgbaMatch.groups /* c8 ignore next */ ?? {};
		/* c8 ignore start */
		if (!r || !g || !b) {
			return undefined;
		}
		/* c8 ignore stop */

		const rgb = [r, g, b].map(x => Number.parseInt(x, 10));
		const alpha = a ? (p ? Number.parseFloat(a) * 0.01 : Number.parseFloat(a)) : 1;
		return normalizeRgba([...rgb, alpha]);
	}

	const perMatch = perPattern.exec(rgbString);
	if (perMatch) {
		const {r, g, b, a, p} = perMatch.groups /* c8 ignore next */ ?? {};
		/* c8 ignore start */
		if (!r || !g || !b) {
			return undefined;
		}
		/* c8 ignore stop */

		const rgb = [r, g, b].map(x => Math.round(Number.parseFloat(x) * 2.55));
		const alpha = a ? (p ? Number.parseFloat(a) * 0.01 : Number.parseFloat(a)) : 1;
		return normalizeRgba([...rgb, alpha]);
	}

	const keywordMatch = keywordPattern.exec(rgbString);
	if (keywordMatch) {
		const keyword = keywordMatch.groups?.['keyword'];
		/* c8 ignore start */
		if (!keyword) {
			return undefined;
		}
		/* c8 ignore stop */

		if (keyword === 'transparent') {
			return [0, 0, 0, 0];
		}

		if (!Object.hasOwn(colorNames, keyword)) {
			return undefined;
		}

		const rgb = colorNames[keyword as keyof typeof colorNames];
		return normalizeRgba([...rgb, 1]);
	}

	return undefined;
};

export const getHsl = (hslString: string) => {
	if (!hslString) {
		return undefined;
	}

	const hsl = /^hsla?\(\s*(?<h_>[+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*(?<s_>[+-]?[\d.]+)%\s*,?\s*(?<l_>[+-]?[\d.]+)%\s*(?:[,|/]\s*(?<a_>[+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;

	const hslMatch = hsl.exec(hslString);
	if (hslMatch) {
		const {h_, s_, l_, a_} = hslMatch.groups /* c8 ignore next */ ?? {};
		/* c8 ignore start */
		if (!h_ || !s_ || !l_) {
			return undefined;
		}
		/* c8 ignore stop */

		const alpha = Number.parseFloat(a_ ?? '');
		const h = hueClamp(Number.parseFloat(h_));
		const s = percentClamp(Number.parseFloat(s_));
		const l = percentClamp(Number.parseFloat(l_));
		const a = alphaClamp(Number.isNaN(alpha) ? 1 : alpha);

		return [h, s, l, a];
	}

	return undefined;
};

export const getHwb = (hwbString: string) => {
	if (!hwbString) {
		return undefined;
	}

	const hwb = /^hwb\(\s*(?<h_>[+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*(?<w_>[+-]?[\d.]+)%\s*,\s*(?<b_>[+-]?[\d.]+)%\s*(?:,\s*(?<a_>[+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;

	const hwbMatch = hwb.exec(hwbString);
	if (hwbMatch) {
		const {h_, w_, b_, a_} = hwbMatch.groups /* c8 ignore next */ ?? {};
		/* c8 ignore start */
		if (!h_ || !w_ || !b_) {
			return null;
		}
		/* c8 ignore stop */

		const alpha = Number.parseFloat(a_ ?? '');
		const h = hueClamp(Number.parseFloat(h_));
		const w = percentClamp(Number.parseFloat(w_));
		const b = percentClamp(Number.parseFloat(b_));
		const a = alphaClamp(Number.isNaN(alpha) ? 1 : alpha);
		return [h, w, b, a];
	}

	return undefined;
};

export const getColor = (colorString: string) => {
	const prefix = colorString.slice(0, 3).toLowerCase();
	let value;
	let model;
	switch (prefix) {
		case 'hsl': {
			value = getHsl(colorString);
			model = 'hsl';
			break;
		}

		case 'hwb': {
			value = getHwb(colorString);
			model = 'hwb';
			break;
		}

		default: {
			value = getRgb(colorString);
			model = 'rgb';
			break;
		}
	}

	if (!value) {
		return undefined;
	}

	return {model, value};
};

export const toHex = (r: number, g: number, b: number, a = 1) => {
	const alpha = alphaClamp(a);
	return '#' +
		hexDouble(rgbClamp(r)) +
		hexDouble(rgbClamp(g)) +
		hexDouble(rgbClamp(b)) +
		(alpha < 1
			? (hexDouble(Math.round(alpha * 255)))
			: '');
};

export const toRgb = (r: number, g: number, b: number, a = 1) => {
	const alpha = alphaClamp(a);
	return alpha === 1
		? 'rgb(' + Math.round(rgbClamp(r)) + ', ' + Math.round(rgbClamp(g)) + ', ' + Math.round(rgbClamp(b)) + ')'
		: 'rgba(' + Math.round(rgbClamp(r)) + ', ' + Math.round(rgbClamp(g)) + ', ' + Math.round(rgbClamp(b)) + ', ' + alpha + ')';
};

export const toRgbPercent = (r: number, g: number, b: number, a = 1) => {
	const r_ = Math.round(rgbClamp(r) / 255 * 100);
	const g_ = Math.round(rgbClamp(g) / 255 * 100);
	const b_ = Math.round(rgbClamp(b) / 255 * 100);
	const alpha = alphaClamp(a);
	return alpha === 1
		? 'rgb(' + r_ + '%, ' + g_ + '%, ' + b_ + '%)'
		: 'rgba(' + r_ + '%, ' + g_ + '%, ' + b_ + '%, ' + alpha + ')';
};

export const toHsl = (h: number, s: number, l: number, a = 1) => {
	const alpha = alphaClamp(a);
	return alpha === 1
		? 'hsl(' + hueClamp(h) + ', ' + percentClamp(s) + '%, ' + percentClamp(l) + '%)'
		: 'hsla(' + hueClamp(h) + ', ' + percentClamp(s) + '%, ' + percentClamp(l) + '%, ' + alpha + ')';
};

export const toHwb = (h: number, w: number, b: number, a = 1) => {
	const alpha = alphaClamp(a);
	const a_ = alpha === 1 ? '' : (', ' + alpha);
	return 'hwb(' + hueClamp(h) + ', ' + percentClamp(w) + '%, ' + percentClamp(b) + '%' + a_ + ')';
};

export const toKeyword = (r: number, g: number, b: number) => reversedColorNames[[rgbClamp(r), rgbClamp(g), rgbClamp(b)].join(',')];
