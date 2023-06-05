import {expectType} from 'tsd';
import colorString from './index.js';
import type {Model} from './index.js';

type GetColorResult = {model: Model; value: number[]} | undefined;
type GetSpecificTypeResult = number[] | undefined;

type ToColorResult = string | undefined;

expectType<GetColorResult>(colorString.get('#FFF'));
expectType<GetColorResult>(colorString.get('#FFFA'));
expectType<GetColorResult>(colorString.get('hsl(360, 100%, 50%)'));
expectType<GetColorResult>(colorString.get('hsl(360 100% 50%)'));
expectType<GetColorResult>(colorString.get('hwb(60, 3%, 60%)'));

expectType<GetSpecificTypeResult>(colorString.get.rgb('#FFF'));
expectType<GetSpecificTypeResult>(colorString.get.rgb('blue'));
expectType<GetSpecificTypeResult>(colorString.get.rgb('#FFF'));
expectType<GetSpecificTypeResult>(colorString.get.rgb('blue'));
expectType<GetSpecificTypeResult>(colorString.get.rgb('rgba(200, 60, 60, 0.3)'));
expectType<GetSpecificTypeResult>(colorString.get.rgb('rgba(200 60 60 / 0.3)'));
expectType<GetSpecificTypeResult>(colorString.get.rgb('rgba(200 60 60 / 30%)'));
expectType<GetSpecificTypeResult>(colorString.get.rgb('rgb(200, 200, 200)'));
expectType<GetSpecificTypeResult>(colorString.get.rgb('rgb(200 200 200)'));

expectType<GetSpecificTypeResult>(colorString.get.hsl('hsl(360, 100%, 50%)'));
expectType<GetSpecificTypeResult>(colorString.get.hsl('hsl(360 100% 50%)'));
expectType<GetSpecificTypeResult>(colorString.get.hsl('hsla(360, 60%, 50%, 0.4)'));
expectType<GetSpecificTypeResult>(colorString.get.hsl('hsl(360 60% 50% / 0.4)'));

expectType<GetSpecificTypeResult>(colorString.get.hwb('hwb(60, 3%, 60%)'));
expectType<GetSpecificTypeResult>(colorString.get.hwb('hwb(60, 3%, 60%, 0.6)'));

expectType<GetSpecificTypeResult>(colorString.get.rgb('invalid color string'));

expectType<ToColorResult>(colorString.to.hex(255, 255, 255));
expectType<ToColorResult>(colorString.to.hex(0, 0, 255, 0.4));
expectType<ToColorResult>(colorString.to.hex(0, 0, 255, 0.4));
expectType<ToColorResult>(colorString.to.rgb(255, 255, 255));
expectType<ToColorResult>(colorString.to.rgb(0, 0, 255, 0.4));
expectType<ToColorResult>(colorString.to.rgb(0, 0, 255, 0.4));
expectType<ToColorResult>(colorString.to.rgb.percent(0, 0, 255));
expectType<ToColorResult>(colorString.to.keyword(255, 255, 0));
expectType<ToColorResult>(colorString.to.hsl(360, 100, 100));
expectType<ToColorResult>(colorString.to.hwb(50, 3, 15));
