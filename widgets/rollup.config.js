import typescript from '@rollup/plugin-typescript';
import { readdirSync } from "fs";
import { parse } from "path";

const WIDGET_LOADER_BANNER = `
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: __iconColor__; icon-glyph: __iconGlyph__;
`;

const widgetModuleFilenames = readdirSync("code/widget-modules/")
    .filter(fileName => fileName.endsWith("WidgetModule.ts"));

export default [
    {
        input: 'code/widgetLoader.ts',
        output: {
            dir: '../scriptable-api/public/compiled-widgets/',
            format: 'es',
            strict: false,
            banner: WIDGET_LOADER_BANNER,
        },
        plugins: [typescript()]
    },
    ...(widgetModuleFilenames.map(fileName => ({
        input: `code/widget-modules/${fileName}`,
        output: {
            dir: '../scriptable-api/public/compiled-widgets/widget-modules',
            format: 'iife',
            strict: false,
            name: parse(fileName).name
        },
        plugins: [typescript()]

    }))),
];