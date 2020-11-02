import typescript from '@rollup/plugin-typescript';
const loaderBanner = `
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: __iconColor__; icon-glyph: __iconGlyph__;
`;

export default [
    // {
    //     input: ['code/emittime-script-own.ts'],
    //     output: {
    //         dir: '../api/compiled-widgets',
    //         format: 'iife',
    //         strict: false
    //     },
    //     plugins: [typescript()]
    // },
    // {
    //     input: ['code/emittime-script-following.ts'],
    //     output: {
    //         dir: '../api/compiled-widgets',
    //         format: 'iife',
    //         strict: false
    //     },
    //     plugins: [typescript()]
    // },
    {
        input: ['code/widget-loader.ts'],
        output: {
            dir: '../scriptable-api/public/compiled-widgets/',
            format: 'iife',
            strict: false,
            banner: loaderBanner,
        },
        plugins: [typescript()]
    },
    {
        input: ['code/emittime-script-own-module.ts'],
        output: {
            dir: '../scriptable-api/public/compiled-widgets/widget-modules',
            format: 'cjs',
            strict: false,
            exports: "default"
        },
        plugins: [typescript()]
    },
    {
        input: ['code/sticky-widget-module.ts'],
        output: {
            dir: '../scriptable-api/public/compiled-widgets/widget-modules',
            format: 'cjs',
            strict: false,
            exports: "default"
        },
        plugins: [typescript()]
    }
];