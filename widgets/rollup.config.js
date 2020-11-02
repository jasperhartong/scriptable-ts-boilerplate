import typescript from '@rollup/plugin-typescript';

const loaderBanner = `
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: __iconColor__; icon-glyph: __iconGlyph__;
`;

const widgetModuleInputs = [
    "code/sticky-widget-module.ts",
    "code/covid19-widget-module.ts"
]

export default [
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
    ...(widgetModuleInputs.map(input => ({
        input,
        output: {
            dir: '../scriptable-api/public/compiled-widgets/widget-modules',
            format: 'cjs',
            strict: false,
            exports: "default"
        },
        plugins: [typescript()]

    }))),
];