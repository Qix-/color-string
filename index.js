import colorNames from 'color-name';

const reverseNames = Object.create(null);

// Create a list of reverse color names
for (const name in colorNames) {
	if (Object.hasOwn(colorNames, name)) {
		reverseNames[colorNames[name]] = name;
	}
}

const cs = {
	to: {},
	get: {},
};

cs.get = function (string) {
	const prefix = string.slice(0, string.indexOf("(")).toLowerCase();
	let value;
	let model;
	switch (prefix) {
		case 'hsl': {
			value = cs.get.hsl(string);
			model = 'hsl';
			break;
		}

		case 'hwb': {
			value = cs.get.hwb(string);
			model = 'hwb';
			break;
		}

		case 'oklch': {
			value = cs.get.oklch(string);
			model = 'oklch';
			break;
		}

		case 'lab': {
			value = cs.get.lab(string);
			model = 'lab';
			break;
		}

		default: {
			value = cs.get.rgb(string);
			model = 'rgb';
			break;
		}
	}

	if (!value) {
		return null;
	}

	return {model, value};
};

cs.get.rgb = function (string) {
	if (!string) {
		return null;
	}

	const abbr = /^#([a-f\d]{3,4})$/i;
	const hex = /^#([a-f\d]{6})([a-f\d]{2})?$/i;
	const rgba = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[\s,|/]\s*([+-]?[\d.]+)(%?)\s*)?\)$/;
	const per = /^rgba?\(\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*(?:[\s,|/]\s*([+-]?[\d.]+)(%?)\s*)?\)$/;
	const keyword = /^(\w+)$/;

	let rgb = [0, 0, 0, 1];
	let match;
	let i;
	let hexAlpha;

	if (match = string.match(hex)) {
		hexAlpha = match[2];
		match = match[1];

		for (i = 0; i < 3; i++) {
			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
			const i2 = i * 2;
			rgb[i] = Number.parseInt(match.slice(i2, i2 + 2), 16);
		}

		if (hexAlpha) {
			rgb[3] = Number.parseInt(hexAlpha, 16) / 255;
		}
	} else if (match = string.match(abbr)) {
		match = match[1];
		hexAlpha = match[3];

		for (i = 0; i < 3; i++) {
			rgb[i] = Number.parseInt(match[i] + match[i], 16);
		}

		if (hexAlpha) {
			rgb[3] = Number.parseInt(hexAlpha + hexAlpha, 16) / 255;
		}
	} else if (match = string.match(rgba)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = Number.parseInt(match[i + 1], 10);
		}

		if (match[4]) {
			rgb[3] = match[5] ? Number.parseFloat(match[4]) * 0.01 : Number.parseFloat(match[4]);
		}
	} else if (match = string.match(per)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = Math.round(Number.parseFloat(match[i + 1]) * 2.55);
		}

		if (match[4]) {
			rgb[3] = match[5] ? Number.parseFloat(match[4]) * 0.01 : Number.parseFloat(match[4]);
		}
	} else if (match = string.match(keyword)) {
		if (match[1] === 'transparent') {
			return [0, 0, 0, 0];
		}

		if (!Object.hasOwn(colorNames, match[1])) {
			return null;
		}

		rgb = colorNames[match[1]];
		rgb[3] = 1;

		return rgb;
	} else {
		return null;
	}

	for (i = 0; i < 3; i++) {
		rgb[i] = clamp(rgb[i], 0, 255);
	}

	rgb[3] = clamp(rgb[3], 0, 1);

	return rgb;
};

cs.get.hsl = function (string) {
	if (!string) {
		return null;
	}

	const hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*(?:[,|/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
	const match = string.match(hsl);

	if (match) {
		const alpha = Number.parseFloat(match[4]);
		const h = ((Number.parseFloat(match[1]) % 360) + 360) % 360;
		const s = clamp(Number.parseFloat(match[2]), 0, 100);
		const l = clamp(Number.parseFloat(match[3]), 0, 100);
		const a = clamp(Number.isNaN(alpha) ? 1 : alpha, 0, 1);

		return [h, s, l, a];
	}

	return null;
};

cs.get.hwb = function (string) {
	if (!string) {
		return null;
	}

	const hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*[\s,]\s*([+-]?[\d.]+)%\s*[\s,]\s*([+-]?[\d.]+)%\s*(?:[\s,]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
	const match = string.match(hwb);

	if (match) {
		const alpha = Number.parseFloat(match[4]);
		const h = ((Number.parseFloat(match[1]) % 360) + 360) % 360;
		const w = clamp(Number.parseFloat(match[2]), 0, 100);
		const b = clamp(Number.parseFloat(match[3]), 0, 100);
		const a = clamp(Number.isNaN(alpha) ? 1 : alpha, 0, 1);
		return [h, w, b, a];
	}

	return null;
};

cs.get.lab = function (string) {
	if (!string) {
		return null;
	}

	const lab = /^lab\(\s*(?<L>([0-9]{1,3}(\.\d*)?%?)|(none))\s+(?<a>(-?[0-9]{1,3}(\.\d*)?%?)|(none))\s+(?<b>(-?[0-9]{1,3}(\.\d*)?%?)|(none))(\s+\/\s+(?<A>(([0-9]{1,3}(\.\d+)?|(\.\d+))%?)|(none)))?\)$/;
	const match = string.match(lab);

	if (match) {
		const match_L = match.groups.L;
		const match_a = match.groups.a;
		const match_b = match.groups.b;
		const match_alpha = match.groups.A || 'none';

		// a and b are numbers between -125 and 125 or percentages between -100% and 100%
		const parseAB = (str) => {
			if (str == "none")
				return 0; // default value for "none"
			if (str.endsWith("%")) {
				const percentage = Number.parseFloat(str.slice(0, -1));
				return percentage * 1.25;
			}
			return Number.parseFloat(str);
		}

		let a = clamp(parseAB(match_a), -125, 125);
		let b = clamp(parseAB(match_b), -125, 125);

		let L = 0; // default value for "none"
		let alpha = 1; // default value for "none"

		// L is a number between 0 and 100 or a percentage between 0% and 100%
		if (match_L != "none")
			L = clamp(match_L.endsWith("%") ? Number.parseFloat(match_L.slice(0, -1)) : Number.parseFloat(match_L), 0, 100);

		// Alpha is a number between 0 and 1 or a percentage between 0% and 100%; it is optional and defaults to 1
		if (match_alpha.length > 0 && match_alpha != "none")
			alpha = clamp(match_alpha.endsWith("%") ? Number.parseFloat(match_alpha.slice(0, -1)) / 100 : Number.parseFloat(match_alpha), 0, 1);

		return [L, a, b, alpha];
	}

	return null;
};

cs.get.oklch = function (string) {
	if (!string) {
		return null;
	}

	const oklch = /^oklch\(\s*(?<L>(([0-9]{1,3}(\.\d*)?%)|[0-1]?(\.\d*)?)|(none))\s+(?<C>(-?[0-9]{1,3}(\.\d*)?%?)|(none))\s+(?<H>(-?[0-9]{1,3}(\.\d*)?(deg)?)|(none))(\s+\/\s+(?<A>((([0-9]{1,3}(\.\d+)?)|(\.\d+))%?)|(none)))?\)$/;
	const match = string.match(oklch);

	if (match) {
		const match_L = match.groups.L.replace("none", "0%");
		const match_C = match.groups.C.replace("none", "0%");
		const match_H = match.groups.H.replace("none", "0");
		const match_alpha = (match.groups.A || "100%").replace("none", "100%");

		// L (perceived lightness): number between 0 and 1 or percentage between 0% and 100% or "none" (= 0%)
		let L = clamp(match_L.endsWith("%") ? Number.parseFloat(match_L.slice(0, -1)) / 100 : Number.parseFloat(match_L), 0, 1);

		// C (chroma): number from 0 (no max) or percentage from 0% (0% = 0, 100% = 0.4) or "none" (= 0%)
		let C = match_C.endsWith("%") ? Number.parseFloat(match_C.slice(0, -1)) / 250 : Number.parseFloat(match_C);
		if (C < 0)
			C = 0;

		// H (hue): number or angle or "none" (= 0deg), no min/max
		let H = Number.parseFloat(match_H.replace("deg", ""));

		// A (alpha, optional): number between 0 and 1 or percentage between 0% and 100% or "none" (= 100%)
		let A = 1;
		if (match_alpha.length)
			A = clamp(match_alpha.endsWith("%") ? Number.parseFloat(match_alpha) / 100 : Number.parseFloat(match_alpha), 0, 1);

		return [L, C, H, A];
	}

	return null;
};

cs.to.hex = function (...rgba) {
	return (
		'#' +
		hexDouble(rgba[0]) +
		hexDouble(rgba[1]) +
		hexDouble(rgba[2]) +
		(rgba[3] < 1
			? (hexDouble(Math.round(rgba[3] * 255)))
			: '')
	);
};

cs.to.rgb = function (...rgba) {
	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
		: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
};

cs.to.rgb.percent = function (...rgba) {
	const r = Math.round(rgba[0] / 255 * 100);
	const g = Math.round(rgba[1] / 255 * 100);
	const b = Math.round(rgba[2] / 255 * 100);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};

cs.to.hsl = function (...hsla) {
	return hsla.length < 4 || hsla[3] === 1
		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};

// Hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
cs.to.hwb = function (...hwba) {
	let a = '';
	if (hwba.length >= 4 && hwba[3] !== 1) {
		a = ', ' + hwba[3];
	}

	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};

cs.to.lab = function(...lab) {
	let alpha = '';
	if (lab.length >= 4 && lab[3] != 1) {
		alpha = ' / ' + lab[3];
	}

	return 'lab(' + lab[0] + ' ' + lab[1] + ' ' + lab[2] + alpha + ')';
}

cs.to.oklch = function(...lch) {
	let alpha = '';
	if (lch.length >= 4 && lch[3] != 1) {
		alpha = ' / ' + lch[3];
	}

	return 'oklch(' + lch[0] + ' ' + lch[1] + ' ' + lch[2] + alpha + ')';
}

cs.to.oklch.percent = function(...lch) {
	let alpha = '';
	if (lch.length >= 4 && lch[3] != 1) {
		alpha = ' / ' + lch[3] * 100 + '%';
	}

	return 'oklch(' + lch[0] * 100 + '% ' + lch[1] * 250 + '% ' + lch[2] + 'deg' + alpha + ')';
}

cs.to.keyword = function (...rgb) {
	return reverseNames[rgb.slice(0, 3)];
};

// Helpers
function clamp(number_, min, max) {
	return Math.min(Math.max(min, number_), max);
}

function hexDouble(number_) {
	const string_ = Math.round(number_).toString(16).toUpperCase();
	return (string_.length < 2) ? '0' + string_ : string_;
}

export default cs;
