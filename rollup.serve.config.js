import commonjs from '@rollup/plugin-commonjs';
import del from 'rollup-plugin-delete'
import livereload from 'rollup-plugin-livereload';
import pkg from './package.json';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import rollup from './rollup.config.js';
import serve from 'rollup-plugin-serve';
import sucrase from '@rollup/plugin-sucrase';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

// This creates only development builds used for demo and development
export default Object.assign({}, rollup, {
  output: [
    {
      format: 'cjs',
      file: 'tmp/cjs/index.js'
    },
    {
      format: 'es',
      file: 'tmp/es/index.js'
    },
    {
      format: 'umd',
      name: pkg.moduleName,
      file: 'tmp/umd/index.js'
    },
  ],
  plugins: [
    del({ targets: 'tmp/*' }),
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
    serve({
      open: 'true',
      openPage: '/development.html'
    }),
    livereload({
      watch: 'tmp'
    })
  ]
})
