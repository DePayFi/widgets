import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import sucrase from '@rollup/plugin-sucrase';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

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
    terser({
      output: {
        comments: false
      }
    })
  ]
}
