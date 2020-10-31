import typescript from '@rollup/plugin-typescript';
console.warn("rollup congif")
export default {
    input: ['code/emittime-script-own.ts', 'code/emittime-script-following.ts'],
    output: {
        dir: 'output',
        format: 'cjs',
        strict: false,
    },
    plugins: [typescript()]
};