import typescript from '@rollup/plugin-typescript';

export default [
    {
        input: ['code/emittime-script-own.ts'],
        output: {
            dir: 'output',
            format: 'cjs',
            strict: false
        },
        plugins: [typescript()]
    },
    {
        input: ['code/emittime-script-following.ts'],
        output: {
            dir: 'output',
            format: 'cjs',
            strict: false
        },
        plugins: [typescript()]
    }
];