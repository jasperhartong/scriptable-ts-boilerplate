import typescript from '@rollup/plugin-typescript';

const loaderBanner = `
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: __iconColor__; icon-glyph: __iconGlyph__;
`;

const widgetModuleInputs = [
    "stickyWidgetModule",
    "covid19WidgetModule"
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
    ...(widgetModuleInputs.map(name => ({
        input: `code/${name}.ts`,
        output: {
            dir: '../scriptable-api/public/compiled-widgets/widget-modules',
            format: 'iife',
            strict: false,
            name: name
        },
        plugins: [typescript()]

    }))),
];