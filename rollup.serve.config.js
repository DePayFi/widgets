import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import rollup from './rollup.config.js';
import serve from 'rollup-plugin-serve';
import sucrase from '@rollup/plugin-sucrase';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default Object.assign({}, rollup, {
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
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' ),
      preventAssignment: true
    }),
    serve({
      open: 'true',
      openPage: '/demo.html'
    }),
    livereload({
      watch: 'dist'
    })
  ],
})
