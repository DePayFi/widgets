import commonjs from '@rollup/plugin-commonjs'
import globals from './rollup.globals.js'
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
      file: 'dist/esm/index.js'
    },
    {
      format: 'umd',
      name: pkg.moduleName,
      globals: globals,
      file: 'dist/umd/index.js'
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [
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
