import livereload from 'rollup-plugin-livereload';
import rollup from './rollup.config.js';
import serve from 'rollup-plugin-serve';

export default Object.assign({}, rollup, {
  plugins: rollup.plugins.concat([
    serve({
      open: 'true',
      openPage: '/demo.html'
    }),
    livereload({
      watch: 'dist'
    })
  ]),
})
