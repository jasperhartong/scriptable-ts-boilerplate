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
    }
];