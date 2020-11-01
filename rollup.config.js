import typescript from '@rollup/plugin-typescript';

export default [
    {
        input: ['code/emittime-script-own.ts'],
        output: {
            dir: 'output',
            format: 'iife',
            strict: false
        },
        plugins: [typescript()]
    },
    {
        input: ['code/emittime-script-following.ts'],
        output: {
            dir: 'output',
            format: 'iife',
            strict: false
        },
        plugins: [typescript()]
    },
    {
        input: ['code/widget-loader.ts'],
        output: {
            dir: 'output',
            format: 'iife',
            strict: false
        },
        plugins: [typescript()]
    },
    {
        input: ['code/emittime-script-own-module.ts'],
        output: {
            dir: 'output',
            format: 'cjs',
            strict: false,
            exports: "default"
        },
        plugins: [typescript()]
    }
];