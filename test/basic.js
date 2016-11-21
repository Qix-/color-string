var assert = require('assert');
var string = require('../');

assert.deepEqual(string.get.rgb('#fef'), [255, 238, 255, 1]);
assert.deepEqual(string.get.rgb('#fffFEF'), [255, 255, 239, 1]);
assert.deepEqual(string.get.rgb('rgb(244, 233, 100)'), [244, 233, 100, 1]);
assert.deepEqual(string.get.rgb('rgb(100%, 30%, 90%)'), [255, 77, 229, 1]);
assert.deepEqual(string.get.rgb('transparent'), [0, 0, 0, 0]);
assert.deepEqual(string.get.hsl('hsl(240, 100%, 50.5%)'), [240, 100, 50.5, 1]);
assert.deepEqual(string.get.hsl('hsl(240deg, 100%, 50.5%)'), [240, 100, 50.5, 1]);
assert.deepEqual(string.get.hwb('hwb(240, 100%, 50.5%)'), [240, 100, 50.5, 1]);
assert.deepEqual(string.get.hwb('hwb(240deg, 100%, 50.5%)'), [240, 100, 50.5, 1]);

// generic .get()
assert.deepEqual(string.get('#fef'), {model: 'rgb', value: [255, 238, 255, 1]});
assert.deepEqual(string.get('#fffFEF'), {model: 'rgb', value: [255, 255, 239, 1]});
assert.deepEqual(string.get('rgb(244, 233, 100)'), {model: 'rgb', value: [244, 233, 100, 1]});
assert.deepEqual(string.get('rgb(100%, 30%, 90%)'), {model: 'rgb', value: [255, 77, 229, 1]});
assert.deepEqual(string.get('transparent'), {model: 'rgb', value: [0, 0, 0, 0]});
assert.deepEqual(string.get('hsl(240, 100%, 50.5%)'), {model: 'hsl', value: [240, 100, 50.5, 1]});
assert.deepEqual(string.get('hsl(240deg, 100%, 50.5%)'), {model: 'hsl', value: [240, 100, 50.5, 1]});
assert.deepEqual(string.get('hwb(240, 100%, 50.5%)'), {model: 'hwb', value: [240, 100, 50.5, 1]});
assert.deepEqual(string.get('hwb(240deg, 100%, 50.5%)'), {model: 'hwb', value: [240, 100, 50.5, 1]});

// invalid generic .get() calls
assert.deepEqual(string.get('hsla(250, 100%, 50%, 50%)'), null);
assert.deepEqual(string.get('rgba(250, 100%, 50%, 50%)'), null);

// with sign
assert.deepEqual(string.get.rgb('rgb(-244, +233, -100)'), [0, 233, 0, 1]);
assert.deepEqual(string.get.hsl('hsl(+240, 100%, 50.5%)'), [240, 100, 50.5, 1]);
assert.deepEqual(string.get.rgb('rgba(200, +20, -233, -0.0)'), [200, 20, 0, 0]);
assert.deepEqual(string.get.rgb('rgba(200, +20, -233, -0.0)'), [200, 20, 0, 0]);
assert.deepEqual(string.get.hsl('hsla(+200, 100%, 50%, -0.2)'), [200, 100, 50, 0]);
assert.deepEqual(string.get.hsl('hsla(-10.0, 100%, 50%, -0.2)'), [350, 100, 50, 0]);
assert.deepEqual(string.get.hsl('hsla(.5, 100%, 50%, -0.2)'), [0.5, 100, 50, 0]);
assert.deepEqual(string.get.hwb('hwb(+240, 100%, 50.5%)'), [240, 100, 50.5, 1]);
assert.deepEqual(string.get.hwb('hwb(-240deg, 100%, 50.5%)'), [120, 100, 50.5, 1]);
assert.deepEqual(string.get.hwb('hwb(-240deg, 100%, 50.5%, +0.6)'), [120, 100, 50.5, 0.6]);
assert.deepEqual(string.get.hwb('hwb(10.0deg, 100%, 50.5%)'), [10, 100, 50.5, 1]);
assert.deepEqual(string.get.hwb('hwb(-.5, 100%, 50.5%)'), [359.5, 100, 50.5, 1]);
assert.deepEqual(string.get.hwb('hwb(-10.0deg, 100%, 50.5%, +0.6)'), [350, 100, 50.5, 0.6]);

// subsequent return values should not change array
assert.deepEqual(string.get.rgb('blue'), [0, 0, 255, 1]);
assert.deepEqual(string.get.rgb('blue'), [0, 0, 255, 1]);

// alpha
assert.deepEqual(string.get.rgb('rgba(200, 20, 233, 0.2)'), [200, 20, 233, 0.2]);
assert.deepEqual(string.get.rgb('rgba(200, 20, 233, 0)'), [200, 20, 233, 0]);
assert.deepEqual(string.get.rgb('rgba(100%, 30%, 90%, 0.2)'), [255, 77, 229, 0.2]);
assert.deepEqual(string.get.hsl('hsla(200, 20%, 33%, 0.2)'), [200, 20, 33, 0.2]);
assert.deepEqual(string.get.hwb('hwb(200, 20%, 33%, 0.2)'), [200, 20, 33, 0.2]);

// no alpha
assert.deepEqual(string.get.rgb('#fef'), [255, 238, 255, 1]);
assert.deepEqual(string.get.rgb('rgba(200, 20, 233, 0.2)'), [200, 20, 233, 0.2]);
assert.deepEqual(string.get.hsl('hsl(240, 100%, 50.5%)'), [240, 100, 50.5, 1]);
assert.deepEqual(string.get.rgb('rgba(0,0,0,0)'), [0, 0, 0, 0]);
assert.deepEqual(string.get.hsl('hsla(0,0%,0%,0)'), [0, 0, 0, 0]);
assert.deepEqual(string.get.hwb('hwb(400, 10%, 200%, 0)'), [40, 10, 100, 0]);

// range
assert.deepEqual(string.get.rgb('rgba(300, 600, 100, 3)'), [255, 255, 100, 1]);
assert.deepEqual(string.get.rgb('rgba(8000%, 100%, 333%, 88)'), [255, 255, 255, 1]);
assert.deepEqual(string.get.hsl('hsla(400, 10%, 200%, 10)'), [40, 10, 100, 1]);
assert.deepEqual(string.get.hwb('hwb(400, 10%, 200%, 10)'), [40, 10, 100, 1]);

// invalid
assert.strictEqual(string.get.rgb('yellowblue'), null);
assert.strictEqual(string.get.rgb('hsl(100, 10%, 10%)'), null);
assert.strictEqual(string.get.rgb('hwb(100, 10%, 10%)'), null);
assert.strictEqual(string.get.rgb('rgb(123, 255, 9)1234'), null);
assert.strictEqual(string.get.rgb('rgb(123, 255, 9, 0.1)'), null);
assert.strictEqual(string.get.rgb('rgba(123, 255, 9)'), null);
assert.strictEqual(string.get.rgb('rgba(123, 255, 9, 0.)'), null);
assert.strictEqual(string.get.hsl('hsl(41, 50%, 45%)1234'), null);
assert.strictEqual(string.get.hsl('hsl(41, 50%, 45%, 0.1)'), null);
assert.strictEqual(string.get.hsl('hsla(41, 50%, 45%)'), null);
assert.strictEqual(string.get.hsl('hsla(41, 50%, 45%, 1.)'), null);
assert.strictEqual(string.get.hwb('hwb(240, 100%, 50.5%)1234'), null);
assert.strictEqual(string.get.hwb('hwb(240, 100%, 50.%, 1)'), null);

// generators
assert.equal(string.to.hex([255, 10, 35]), '#FF0A23');

assert.equal(string.to.rgb([255, 10, 35]), 'rgb(255, 10, 35)');
assert.equal(string.to.rgb([255, 10, 35, 0.3]), 'rgba(255, 10, 35, 0.3)');
assert.equal(string.to.rgb([255, 10, 35], 0.3), 'rgba(255, 10, 35, 0.3)');
assert.equal(string.to.rgb([255, 10, 35, 0.3]), 'rgba(255, 10, 35, 0.3)');
assert.equal(string.to.rgb([255, 10, 35], 0.3), 'rgba(255, 10, 35, 0.3)');
assert.equal(string.to.rgb([255, 10, 35]), 'rgb(255, 10, 35)');
assert.equal(string.to.rgb([255, 10, 35, 0]), 'rgba(255, 10, 35, 0)');

assert.equal(string.to.rgb.percent([255, 10, 35]), 'rgb(100%, 4%, 14%)');

assert.equal(string.to.rgb.percent([255, 10, 35, 0.3]), 'rgba(100%, 4%, 14%, 0.3)');
assert.equal(string.to.rgb.percent([255, 10, 35], 0.3), 'rgba(100%, 4%, 14%, 0.3)');
assert.equal(string.to.rgb.percent([255, 10, 35, 0.3]), 'rgba(100%, 4%, 14%, 0.3)');
assert.equal(string.to.rgb.percent([255, 10, 35], 0.3), 'rgba(100%, 4%, 14%, 0.3)');
assert.equal(string.to.rgb.percent([255, 10, 35]), 'rgb(100%, 4%, 14%)');

assert.equal(string.to.hsl([280, 40, 60]), 'hsl(280, 40%, 60%)');
assert.equal(string.to.hsl([280, 40, 60, 0.3]), 'hsla(280, 40%, 60%, 0.3)');
assert.equal(string.to.hsl([280, 40, 60], 0.3), 'hsla(280, 40%, 60%, 0.3)');
assert.equal(string.to.hsl([280, 40, 60, 0.3]), 'hsla(280, 40%, 60%, 0.3)');
assert.equal(string.to.hsl([280, 40, 60], 0.3), 'hsla(280, 40%, 60%, 0.3)');
assert.equal(string.to.hsl([280, 40, 60], 0), 'hsla(280, 40%, 60%, 0)');
assert.equal(string.to.hsl([280, 40, 60]), 'hsl(280, 40%, 60%)');

assert.equal(string.to.hwb([280, 40, 60]), 'hwb(280, 40%, 60%)');
assert.equal(string.to.hwb([280, 40, 60, 0.3]), 'hwb(280, 40%, 60%, 0.3)');
assert.equal(string.to.hwb([280, 40, 60], 0.3), 'hwb(280, 40%, 60%, 0.3)');
assert.equal(string.to.hwb([280, 40, 60], 0), 'hwb(280, 40%, 60%, 0)');

assert.equal(string.to.keyword([255, 255, 0]), 'yellow');
assert.equal(string.to.keyword([100, 255, 0]), undefined);
