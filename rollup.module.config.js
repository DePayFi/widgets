import commonjs from '@rollup/plugin-commonjs'
import del from 'rollup-plugin-delete'
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
      format: 'cjs',
      exports: 'default',
      globals: globals,
      file: 'dist/cjs/index.js'
    },
    {
      format: 'es',
      globals: globals,
      file: 'dist/es/index.js'
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
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    del({ targets: 'dist/*' }),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**'
    }),
    babel({ 
      babelHelpers: 'runtime',
      plugins: [
        '@babel/transform-runtime'
      ]
    }),
    resolve({
      extensions: ['.js', '.ts', '.jsx']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' ),
      preventAssignment: true
    })
  ]
}
