import commonjs from '@rollup/plugin-commonjs';
import del from 'rollup-plugin-delete'
import pkg from './package.json';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import sucrase from '@rollup/plugin-sucrase';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

// This creates production builds
export default {
  input: 'src/index.js',
  output: [
    {
      format: 'cjs',
      file: 'dist/cjs/index.js'
    },
    {
      format: 'es',
      file: 'dist/es/index.js'
    },
    {
      format: 'umd',
      name: pkg.moduleName,
      file: 'dist/umd/index.js'
    },
  ],
  external: [
    // ...Object.keys(pkg.dependencies || {}),
    // ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    del({ targets: 'dist/*' }),
    sucrase({
      exclude: ['node_modules/**'],
      transforms: ['typescript', 'jsx']
    }),
    resolve({
      extensions: ['.js', '.ts', '.jsx']
    }),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    }),
    terser({
      output: {
        comments: false
      }
    })
  ]
}
