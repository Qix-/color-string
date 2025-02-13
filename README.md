# color-string

> library for parsing and generating CSS color strings.

## Install

```sh
npm install color-string
```

## Usage

### Parsing

```js
import {getColor, getRgb, getHsl, getHwb} from 'color-string';

getColor('#FFF')                    // {model: 'rgb', value: [255, 255, 255, 1]}
getColor('#FFFA')                   // {model: 'rgb', value: [255, 255, 255, 0.67]}
getColor('#FFFFFFAA')               // {model: 'rgb', value: [255, 255, 255, 0.67]}
getColor('rgb(244 233 100)')        // {model: 'rgb' value: [244, 233, 100, 1]});
getColor('rgb(100%, 30%, 90%)')     // {model: 'rgb', value: [255, 77, 229, 1]});
getColor('rgb(100% 30% 90%)')       // {model: 'rgb', value: [255, 77, 229, 1]});
getColor('hsl(360, 100%, 50%)')     // {model: 'hsl', value: [0, 100, 50, 1]}
getColor('hsl(360 100% 50%)')       // {model: 'hsl', value: [0, 100, 50, 1]}
getColor('hwb(60, 3%, 60%)')        // {model: 'hwb', value: [60, 3, 60, 1]}

getRgb('#FFF')                      // [255, 255, 255, 1]
getRgb('blue')                      // [0, 0, 255, 1]
getRgb('rgba(200, 60, 60, 0.3)')    // [200, 60, 60, 0.3]
getRgb('rgba(200 60 60 / 0.3)')     // [200, 60, 60, 0.3]
getRgb('rgba(200 60 60 / 30%)')     // [200, 60, 60, 0.3]
getRgb('rgb(200, 200, 200)')        // [200, 200, 200, 1]
getRgb('rgb(200 200 200)')          // [200, 200, 200, 1]

getHsl('hsl(360, 100%, 50%)')       // [0, 100, 50, 1]
getHsl('hsl(360 100% 50%)')         // [0, 100, 50, 1]
getHsl('hsla(360, 60%, 50%, 0.4)')  // [0, 60, 50, 0.4]
getHsl('hsl(360 60% 50% / 0.4)')    // [0, 60, 50, 0.4]

getHwb('hwb(60, 3%, 60%)')          // [60, 3, 60, 1]
getHwb('hwb(60, 3%, 60%, 0.6)')     // [60, 3, 60, 0.6]

getRgb('invalid color string')      // undefined
```

### Generation

```js
import {toHex, toRgb, toRgbPercent, toKeyword, toHsl, toHwb} from 'color-string';

toHex(255, 255, 255)     // "#FFFFFF"
toHex(0, 0, 255, 0.4)    // "#0000FF66"
toHex(0, 0, 255, 0.4)    // "#0000FF66"
toRgb(255, 255, 255)     // "rgb(255, 255, 255)"
toRgb(0, 0, 255, 0.4)    // "rgba(0, 0, 255, 0.4)"
toRgb(0, 0, 255, 0.4)    // "rgba(0, 0, 255, 0.4)"
toRgbPercent(0, 0, 255)  // "rgb(0%, 0%, 100%)"
toKeyword(255, 255, 0)   // "yellow"
toHsl(360, 100, 100)     // "hsl(360, 100%, 100%)"
toHwb(50, 3, 15)         // "hwb(50, 3%, 15%)"
```

### Utilities

```js
import {alphaClamp, rgbClamp, hueClamp, percentClamp} from 'color-string';

alphaClamp(-1)           // 0
alphaClamp(0.5)          // 0.5
alphaClamp(1)            // 1
alphaClamp(2)            // 1

rgbClamp(-255)           // 0
rgbClamp(128)            // 128
rgbClamp(255)            // 255
rgbClamp(256)            // 255

hueClamp(-40)            // 320
hueClamp(40)             // 40
hueClamp(360)            // 0
hueClamp(400)            // 40

percentClamp(-1)         // 0
percentClamp(10)         // 10
percentClamp(100)        // 100
percentClamp(101)        // 100
```

## License

MIT
