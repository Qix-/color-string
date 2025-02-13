import test from 'ava';
import colorNames from 'color-name';
import {
	getRgb, getHsl, getHwb, getColor, toHex, toRgb, toRgbPercent, toHsl, toHwb, toKeyword,
} from './distribution/index.js';

function normalizeAlpha(result) {
	if (result.model === 'rgb' && result.value.length >= 4) {
		result.value[3] = result.value[3].toFixed(2);
	} else if (result.length >= 4) {
		result[3] = result[3].toFixed(2);
	}

	return result;
}

test('getRgb()', t => {
	t.is(getRgb(''), undefined);
	t.is(getRgb('unicorn'), undefined);
	t.is(getRgb('invalid color string'), undefined);
	t.deepEqual(getRgb('transparent'), [0, 0, 0, 0]);
	t.deepEqual(getRgb('#fef'), [255, 238, 255, 1]);
	t.deepEqual(getRgb('#fefe'), [255, 238, 255, 0xEE / 0xFF]);
	t.deepEqual(getRgb('#fffFEF'), [255, 255, 239, 1]);
	t.deepEqual(getRgb('#fffFEFEF'), [255, 255, 239, 0xEF / 0xFF]);
	t.deepEqual(getRgb('rgb(244, 233, 100)'), [244, 233, 100, 1]);
	t.deepEqual(getRgb('rgb(244 233 100)'), [244, 233, 100, 1]);
	t.deepEqual(getRgb('rgb(100%, 30%, 90%)'), [255, 77, 229, 1]);
	t.deepEqual(getRgb('rgb(100% 30% 90%)'), [255, 77, 229, 1]);
	t.deepEqual(getRgb('rgba(244, 233, 100)'), [244, 233, 100, 1]);
	t.deepEqual(getRgb('rgba(244, 233, 100, 0.5)'), [244, 233, 100, 0.5]);
	t.deepEqual(getRgb('rgba(244, 233, 100, 50%)'), [244, 233, 100, 0.5]);
	t.deepEqual(getRgb('rgba(244 233 100 / 0.5)'), [244, 233, 100, 0.5]);
	t.deepEqual(getRgb('rgba(244 233 100 / 50%)'), [244, 233, 100, 0.5]);
	t.deepEqual(getRgb('rgba(100%, 30%, 90%, 0.5)'), [255, 77, 229, 0.5]);
	t.deepEqual(getRgb('rgba(100%, 30%, 90%, 50%)'), [255, 77, 229, 0.5]);
	t.deepEqual(getRgb('rgba(100% 30% 90% / 0.5)'), [255, 77, 229, 0.5]);
	t.deepEqual(getRgb('rgba(100% 30% 90% / 50%)'), [255, 77, 229, 0.5]);
	t.deepEqual(getRgb('rgb(-1, -255, -255, -1)'), [0, 0, 0, 0]);
	t.deepEqual(getRgb('rgb(256, 256, 355)'), [255, 255, 255, 1]);
	for (const [name, color] of Object.entries(colorNames)) {
		t.deepEqual(getRgb(name), [...color, 1]);
	}
});

test('getHsl()', t => {
	t.is(getHsl(''), undefined);
	t.is(getHsl('invalid color string'), undefined);
	t.deepEqual(getHsl('hsla(+200, 100%, 50%, -0.2)'), [200, 100, 50, 0]);
	t.deepEqual(getHsl('hsla(+200, 100%, 50%, -1e-7)'), [200, 100, 50, 0]);
	t.deepEqual(getHsl('hsl(+200 100% 50% / -0.2)'), [200, 100, 50, 0]);
	t.deepEqual(getHsl('hsl(+200 100% 50% / -1e-7)'), [200, 100, 50, 0]);
	t.deepEqual(getHsl('hsl(+200 100% 50% / -2.e7)'), [200, 100, 50, 0]);
	t.deepEqual(getHsl('hsl(+200 100% 50% / +1e7)'), [200, 100, 50, 1]);
	t.deepEqual(getHsl('hsl(+200 100% 50% / 127.88e4)'), [200, 100, 50, 1]);
	t.deepEqual(getHsl('hsl(+200 100% 50% / 0.2e3)'), [200, 100, 50, 1]);
	t.deepEqual(getHsl('hsl(+200 100% 50% / .1e-4)'), [200, 100, 50, 1e-5]);
	t.deepEqual(getHsl('hsla(-10.0, 100%, 50%, -0.2)'), [350, 100, 50, 0]);
	t.deepEqual(getHsl('hsl(-10.0 100% 50% / -0.2)'), [350, 100, 50, 0]);
	t.deepEqual(getHsl('hsla(.5, 100%, 50%, -0.2)'), [0.5, 100, 50, 0]);
	t.deepEqual(getHsl('hsl(.5 100% 50% / -0.2)'), [0.5, 100, 50, 0]);
	t.deepEqual(getHsl('hsla(200, 20%, 33%, 0.2)'), [200, 20, 33, 0.2]);
	t.deepEqual(getHsl('hsla(200, 20%, 33%, 1e-7)'), [200, 20, 33, 1e-7]);
	t.deepEqual(getHsl('hsl(200 20% 33% / 0.2)'), [200, 20, 33, 0.2]);
	t.deepEqual(getHsl('hsl(200 20% 33% / 1e-7)'), [200, 20, 33, 1e-7]);
	t.deepEqual(getHsl('hsl(240, 100%, 50.5%)'), [240, 100, 50.5, 1]);
	t.deepEqual(getHsl('hsl(240 100% 50.5%)'), [240, 100, 50.5, 1]);
	t.deepEqual(getHsl('hsla(0, 0%, 0%, 0)'), [0, 0, 0, 0]);
	t.deepEqual(getHsl('hsl(0 0% 0% / 0)'), [0, 0, 0, 0]);
	t.deepEqual(getHsl('hsl(0deg 0% 0% / 0)'), [0, 0, 0, 0]);
	t.deepEqual(getHsl('hsla(400, 10%, 200%, 10)'), [40, 10, 100, 1]);
	t.deepEqual(getHsl('hsl(400 10% 200% / 10)'), [40, 10, 100, 1]);
	t.is(getHsl('hsl(41, 50%, 45%)1234'), undefined);
	t.is(getHsl('hsl(41 50% 45%)1234'), undefined);
	t.is(getHsl('hsl(41 50% 45% / 3)1234'), undefined);
	t.is(getHsl('hsl(41 50% 45% / 1e)'), undefined);
	t.is(getHsl('hsl(41 50% 45% / e)'), undefined);
	t.is(getHsl('hsl(41 50% 45% / 0e-)'), undefined);
	t.is(getHsl('hsl(41 50% 45% / 0e+)'), undefined);
	t.is(getHsl('hsl(41 50% 45% / +000e33)'), undefined);
});

test('getHwb()', t => {
	t.is(getHwb(''), undefined);
	t.is(getHwb('invalid color string'), undefined);
	t.deepEqual(getHwb('hwb(240, 100%, 50.5%)'), [240, 100, 50.5, 1]);
	t.deepEqual(getHwb('hwb(240deg, 100%, 50.5%)'), [240, 100, 50.5, 1]);
	t.deepEqual(getHwb('hwb(+240, 100%, 50.5%)'), [240, 100, 50.5, 1]);
	t.deepEqual(getHwb('hwb(-240deg, 100%, 50.5%)'), [120, 100, 50.5, 1]);
	t.deepEqual(getHwb('hwb(-240deg, 100%, 50.5%, +0.6)'), [120, 100, 50.5, 0.6]);
	t.deepEqual(getHwb('hwb(-240deg, 100%, 50.5%, +1e-7)'), [120, 100, 50.5, 1e-7]);
	t.deepEqual(getHwb('hwb(-240deg, 100%, 50.5%, -2.e7)'), [120, 100, 50.5, 0]);
	t.deepEqual(getHwb('hwb(-240deg, 100%, 50.5%, +1e7)'), [120, 100, 50.5, 1]);
	t.deepEqual(getHwb('hwb(-240deg, 100%, 50.5%, +1e7)'), [120, 100, 50.5, 1]);
	t.deepEqual(getHwb('hwb(-240deg, 100%, 50.5%, 127.88e4)'), [120, 100, 50.5, 1]);
	t.deepEqual(getHwb('hwb(-240deg, 100%, 50.5%, 0.2e3)'), [120, 100, 50.5, 1]);
	t.deepEqual(getHwb('hwb(-240deg, 100%, 50.5%, .1e-4)'), [120, 100, 50.5, 1e-5]);
	t.deepEqual(getHwb('hwb(10.0deg, 100%, 50.5%)'), [10, 100, 50.5, 1]);
	t.deepEqual(getHwb('hwb(-.5, 100%, 50.5%)'), [359.5, 100, 50.5, 1]);
	t.deepEqual(getHwb('hwb(-10.0deg, 100%, 50.5%, +0.6)'), [350, 100, 50.5, 0.6]);
	t.deepEqual(getHwb('hwb(200, 20%, 33%, 0.2)'), [200, 20, 33, 0.2]);
	t.deepEqual(getHwb('hwb(200, 20%, 33%, 1e-7)'), [200, 20, 33, 1e-7]);
	t.deepEqual(getHwb('hwb(400, 10%, 200%, 0)'), [40, 10, 100, 0]);
	t.deepEqual(getHwb('hwb(400, 10%, 200%, 10)'), [40, 10, 100, 1]);
	t.is(getHwb('hwb(240, 100%, 1e'), undefined);
	t.is(getHwb('hwb(240, 100%, e'), undefined);
	t.is(getHwb('hwb(240, 100%, 0e-'), undefined);
	t.is(getHwb('hwb(240, 100%, 0e+'), undefined);
	t.is(getHwb('hwb(240, 100%, +000e33'), undefined);
});

test('getColor()', t => {
	t.is(getColor(''), undefined);
	t.is(getColor('invalid'), undefined);
	t.is(getColor('invalid color string'), undefined);
	t.deepEqual(getColor('#fef'), {model: 'rgb', value: [255, 238, 255, 1]});
	t.deepEqual(getColor('#fffFEF'), {model: 'rgb', value: [255, 255, 239, 1]});
	t.deepEqual(getColor('#fffFEFff'), {model: 'rgb', value: [255, 255, 239, 1]});
	t.deepEqual(getColor('#fffFEF00'), {model: 'rgb', value: [255, 255, 239, 0]});
	t.deepEqual(normalizeAlpha(getColor('#fffFEFa9')), {model: 'rgb', value: [255, 255, 239, '0.66']});
	t.deepEqual(getColor('rgb(244, 233, 100)'), {model: 'rgb', value: [244, 233, 100, 1]});
	t.deepEqual(getColor('rgb(244 233 100)'), {model: 'rgb', value: [244, 233, 100, 1]});
	t.deepEqual(getColor('rgb(100%, 30%, 90%)'), {model: 'rgb', value: [255, 77, 229, 1]});
	t.deepEqual(getColor('rgb(100% 30% 90%)'), {model: 'rgb', value: [255, 77, 229, 1]});
	t.deepEqual(getColor('transparent'), {model: 'rgb', value: [0, 0, 0, 0]});
	t.deepEqual(getColor('hsl(240, 100%, 50.5%)'), {model: 'hsl', value: [240, 100, 50.5, 1]});
	t.deepEqual(getColor('hsl(-480, 100%, 50.5%)'), {model: 'hsl', value: [240, 100, 50.5, 1]});
	t.deepEqual(getColor('hsl(240 100% 50.5%)'), {model: 'hsl', value: [240, 100, 50.5, 1]});
	t.deepEqual(getColor('hsl(240deg, 100%, 50.5%)'), {model: 'hsl', value: [240, 100, 50.5, 1]});
	t.deepEqual(getColor('hsl(240deg 100% 50.5%)'), {model: 'hsl', value: [240, 100, 50.5, 1]});
	t.deepEqual(getColor('hwb(240, 100%, 50.5%)'), {model: 'hwb', value: [240, 100, 50.5, 1]});
	t.deepEqual(getColor('hwb(240deg, 100%, 50.5%)'), {model: 'hwb', value: [240, 100, 50.5, 1]});
	t.is(getColor('hsla(250, 100%, 50%, 50%)'), undefined);
	t.is(getColor('hsl(250 100% 50% / 50%)'), undefined);
	t.is(getColor('rgba(250, 100%, 50%, 50%)'), undefined);
	t.is(getColor('333333'), undefined);
	t.is(getColor('#1'), undefined);
	t.is(getColor('#f'), undefined);
	t.is(getColor('#4f'), undefined);
	t.is(getColor('#45ab4'), undefined);
	t.is(getColor('#45ab45e'), undefined);
	t.is(getColor('rgb()'), undefined);
	t.is(getColor('rgb(10)'), undefined);
	t.is(getColor('rgb(10,  2)'), undefined);
	t.is(getColor('rgb(10,  2, 2348723dskjfs)'), undefined);
	t.is(getColor('rgb(10%)'), undefined);
	t.is(getColor('rgb(10%,  2%)'), undefined);
	t.is(getColor('rgb(10%,  2%, 2348723%dskjfs)'), undefined);
	t.is(getColor('rgb(10%,  2%, 2348723dskjfs%)'), undefined);
	t.is(getColor('rgb(10$,3)'), undefined);
	t.is(getColor('rgba(10,  3)'), undefined);
});

test('toHex()', t => {
	t.is(toHex(255, 10, 35), '#FF0A23');
	t.is(toHex(255, 10, 35, 1), '#FF0A23');
	t.is(toHex(255, 10, 35, 2), '#FF0A23');
	t.is(toHex(255, 10, 35, 0), '#FF0A2300');
	t.is(toHex(255, 10, 35, -1), '#FF0A2300');
	t.is(toHex(44.2, 83.8, 44), '#2C542C');
	t.is(toHex(255, 10, 35, 0.5), '#FF0A2380');
	t.is(toHex(-1, -255, -255, -1), '#00000000');
	t.is(toHex(256, 256, 355, 2), '#FFFFFF');
});

test('toRgb()', t => {
	t.is(toRgb(255, 10, 35), 'rgb(255, 10, 35)');
	t.is(toRgb(255, 10, 35, 1), 'rgb(255, 10, 35)');
	t.is(toRgb(255, 10, 35, 0), 'rgba(255, 10, 35, 0)');
	t.is(toRgb(255, 10, 35, 0.3), 'rgba(255, 10, 35, 0.3)');
	t.is(toRgb(-255, -10, -35, -1), 'rgba(0, 0, 0, 0)');
	t.is(toRgb(256, 1000, 355, 2), 'rgb(255, 255, 255)');
});

test('toRgbPercent', t => {
	t.is(toRgbPercent(255, 10, 35), 'rgb(100%, 4%, 14%)');
	t.is(toRgbPercent(255, 10, 35, 1), 'rgb(100%, 4%, 14%)');
	t.is(toRgbPercent(255, 10, 35, 0), 'rgba(100%, 4%, 14%, 0)');
	t.is(toRgbPercent(255, 10, 35, 0.3), 'rgba(100%, 4%, 14%, 0.3)');
	t.is(toRgbPercent(-255, -10, -35, -1), 'rgba(0%, 0%, 0%, 0)');
	t.is(toRgbPercent(256, 1000, 355, 2), 'rgb(100%, 100%, 100%)');
});

test('toHsl()', t => {
	t.is(toHsl(280, 40, 60), 'hsl(280, 40%, 60%)');
	t.is(toHsl(280, 40, 60, 0.3), 'hsla(280, 40%, 60%, 0.3)');
	t.is(toHsl(-80, -40, -60, -1), 'hsla(280, 0%, 0%, 0)');
	t.is(toHsl(640, 400, 120, 2), 'hsl(280, 100%, 100%)');
});

test('toHwb()', t => {
	t.is(toHwb(280, 40, 60), 'hwb(280, 40%, 60%)');
	t.is(toHwb(280, 40, 60, 0.3), 'hwb(280, 40%, 60%, 0.3)');
	t.is(toHwb(-80, -40, -60, -1), 'hwb(280, 0%, 0%, 0)');
	t.is(toHwb(640, 400, 120, 2), 'hwb(280, 100%, 100%)');
});

test('toKeyword()', t => {
	t.is(toKeyword(255, 255, 0), 'yellow');
	t.is(toKeyword(100, 255, 0), undefined);
	t.is(toKeyword(-255, -255, -1), 'black');
	t.is(toKeyword(256, 256, 355), 'white');
});
