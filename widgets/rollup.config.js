import typescript from '@rollup/plugin-typescript';

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
            strict: false
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
    }
];