import livereload from 'rollup-plugin-livereload'
import rollup from './rollup.module.config.js'
import serve from 'rollup-plugin-serve'

export default Object.assign({}, rollup, {
  plugins: [...rollup.plugins,
    serve({
      open: 'true',
      openPage: '/dev.html'
    }),
    livereload({
      watch: ['dist', 'src']
    })
  ]
})
