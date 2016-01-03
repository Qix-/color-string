/* MIT license */
var colorNames = require('color-name');

var reverseNames = {};

module.exports = {
	getRgba: getRgba,
	getHsla: getHsla,
	getRgb: getRgb,
	getHsl: getHsl,
	getHwb: getHwb,
	getAlpha: getAlpha,

	hexString: hexString,
	rgbString: rgbString,
	rgbaString: rgbaString,
	percentString: percentString,
	percentaString: percentaString,
	hslString: hslString,
	hslaString: hslaString,
	hwbString: hwbString,
	keyword: keyword
};

function getRgba(string) {
	if (!string) {
		return null;
	}

	var abbr = /^#([a-fA-F0-9]{3})$/;
	var hex = /^#([a-fA-F0-9]{6})$/;
	var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var keyword = /(\D+)/;

	var rgb = [0, 0, 0];
	var a = 1;
	var match = string.match(abbr);
	var i;

	if (match) {
		match = match[1];

		for (i = 0; i < rgb.length; i++) {
			rgb[i] = parseInt(match[i] + match[i], 16);
		}
	} else if (match = string.match(hex)) {
		match = match[1];

		for (i = 0; i < rgb.length; i++) {
			rgb[i] = parseInt(match.slice(i * 2, i * 2 + 2), 16);
		}
	} else if (match = string.match(rgba)) {
		for (i = 0; i < rgb.length; i++) {
			rgb[i] = parseInt(match[i + 1], 0);
		}

		a = parseFloat(match[4]);
	} else if (match = string.match(per)) {
		for (i = 0; i < rgb.length; i++) {
			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
		}

		a = parseFloat(match[4]);
	} else if (match = string.match(keyword)) {
		if (match[1] === 'transparent') {
			return [0, 0, 0, 0];
		}

		rgb = colorNames[match[1]];

		if (!rgb) {
			return null;
		}
	}

	for (i = 0; i < rgb.length; i++) {
		rgb[i] = scale(rgb[i], 0, 255);
	}

	if (!a && a !== 0) {
		a = 1;
	} else {
		a = scale(a, 0, 1);
	}

	rgb[3] = a;
	return rgb;
}

function getHsla(string) {
	if (!string) {
		return null;
	}

	var hsl = /^hsla?\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
	var match = string.match(hsl);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var s = scale(parseFloat(match[2]), 0, 100);
		var l = scale(parseFloat(match[3]), 0, 100);
		var a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);

		return [h, s, l, a];
	}
}

function getHwb(string) {
	if (!string) {
		return null;
	}

	var hwb = /^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
	var match = string.match(hwb);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var w = scale(parseFloat(match[2]), 0, 100);
		var b = scale(parseFloat(match[3]), 0, 100);
		var a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
		return [h, w, b, a];
	}
}

function getRgb(string) {
	var rgba = getRgba(string);
	return rgba && rgba.slice(0, 3);
}

function getHsl(string) {
	var hsla = getHsla(string);
	return hsla && hsla.slice(0, 3);
}

function getAlpha(string) {
	var vals = getRgba(string);
	if (vals) {
		return vals[3];
	} else if (vals = getHsla(string)) {
		return vals[3];
	} else if (vals = getHwb(string)) {
		return vals[3];
	}
}

// generators
function hexString(rgb) {
	return '#' + hexDouble(rgb[0]) + hexDouble(rgb[1]) + hexDouble(rgb[2]);
}

function rgbString(rgba, alpha) {
	if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
		return rgbaString(rgba, alpha);
	}

	return 'rgb(' + rgba[0] + ', ' + rgba[1] + ', ' + rgba[2] + ')';
}

function rgbaString(rgba, alpha) {
	if (alpha === undefined) {
		alpha = (rgba[3] === undefined ? 1 : rgba[3]);
	}

	return 'rgba(' + rgba[0] + ', ' + rgba[1] + ', ' + rgba[2] + ', ' + alpha + ')';
}

function percentString(rgba, alpha) {
	if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
		return percentaString(rgba, alpha);
	}

	var r = Math.round(rgba[0] / 255 * 100);
	var g = Math.round(rgba[1] / 255 * 100);
	var b = Math.round(rgba[2] / 255 * 100);

	return 'rgb(' + r + '%, ' + g + '%, ' + b + '%)';
}

function percentaString(rgba, alpha) {
	var r = Math.round(rgba[0] / 255 * 100);
	var g = Math.round(rgba[1] / 255 * 100);
	var b = Math.round(rgba[2] / 255 * 100);

	return 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + (alpha || rgba[3] || 1) + ')';
}

function hslString(hsla, alpha) {
	if (alpha < 1 || (hsla[3] && hsla[3] < 1)) {
		return hslaString(hsla, alpha);
	}

	return 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)';
}

function hslaString(hsla, alpha) {
	if (alpha === undefined) {
		alpha = (hsla[3] === undefined ? 1 : hsla[3]);
	}

	return 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + alpha + ')';
}

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
function hwbString(hwb, alpha) {
	if (alpha === undefined) {
		alpha = (hwb[3] === undefined ? 1 : hwb[3]);
	}

	return 'hwb(' + hwb[0] + ', ' + hwb[1] + '%, ' + hwb[2] + '%' + (alpha !== undefined && alpha !== 1 ? ', ' + alpha : '') + ')';
}

function keyword(rgb) {
	return reverseNames[rgb.slice(0, 3)];
}

// helpers
function scale(num, min, max) {
	return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
	var str = num.toString(16).toUpperCase();
	return (str.length < 2) ? '0' + str : str;
}

// create a list of reverse color names
for (var name in colorNames) {
	if (colorNames.hasOwnProperty(name)) {
		reverseNames[colorNames[name]] = name;
	}
}
