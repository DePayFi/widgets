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
      host: '0.0.0.0',
      open: 'true',
      port: '8000',
      openPage: 'http://127.0.0.1:8000/dev.html'
    }),
    dev({
      port: '8000',
      proxy: [
        { from: '/track', to:'https://jsonplaceholder.typicode.com/posts' },
        { from: '/login', to:'http://localhost:1337/signature/recover' },
      ],
    }),
    livereload({
      watch: ['dist', 'src']
    })
  ]
})
