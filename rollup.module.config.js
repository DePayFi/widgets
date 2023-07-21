import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'
import globals from './rollup.globals.js'
import jscc from 'rollup-plugin-jscc'
import pkg from './package.json'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: [
    {
      format: 'es',
      globals: globals,
      file: 'dist/esm/index.js',
      sourcemap: true
    },
    {
      format: 'umd',
      name: pkg.moduleName,
      globals: globals,
      file: 'dist/umd/index.js',
      sourcemap: true
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [
    copy({
      targets: [
        { src: 'src/index.d.ts', dest: 'dist/umd/' },
        { src: 'src/index.d.ts', dest: 'dist/umd/', rename: ()=>'index.bundle.d.ts' },
        { src: 'src/index.d.ts', dest: 'dist/umd/', rename: ()=>'index.evm.d.ts' },
        { src: 'src/index.d.ts', dest: 'dist/umd/', rename: ()=>'index.solana.d.ts' },
        { src: 'src/index.d.ts', dest: 'dist/esm/' },
        { src: 'src/index.d.ts', dest: 'dist/esm/', rename: ()=>'index.bundle.d.ts' },
        { src: 'src/index.d.ts', dest: 'dist/esm/', rename: ()=>'index.evm.d.ts' },
        { src: 'src/index.d.ts', dest: 'dist/esm/', rename: ()=>'index.solana.d.ts' },
      ]
    }),
    jscc({ include: 'src/**' }),
    resolve({
      extensions: ['.js', '.ts', '.jsx'],
      modulesOnly: true,
      preferBuiltins: false
    }),
    babel({ 
      babelHelpers: 'runtime',
      plugins: [
        '@babel/transform-runtime'
      ],
      exclude: ['node_modules/**'] // only transpile our source code
    }),
    nodeResolve({ preferBuiltins: false }),
    commonjs({
      include: 'node_modules/**',
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' ),
      preventAssignment: true
    })
  ]
}
