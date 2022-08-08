import globals from './rollup.globals.js'
import livereload from 'rollup-plugin-livereload'
import pkg from './package.json'
import rollup from './rollup.module.config.js'
import serve from 'rollup-plugin-serve'
import dev from 'rollup-plugin-dev'

export default Object.assign({}, rollup, {
  output: [
    {
      format: 'umd',
      name: pkg.moduleName,
      globals: globals,
      file: 'tmp/index.dev.js'
    },
  ],
  plugins: [...rollup.plugins,
    serve({
      open: 'true',
      openPage: 'http://127.0.0.1:8080/dev.html'
    }),
    dev({
      proxy: [{ from: '/track', to:'https://jsonplaceholder.typicode.com/posts' }],
    }),
    livereload({
      watch: ['dist', 'src']
    })
  ]
})
