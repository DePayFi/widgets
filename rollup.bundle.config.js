import nodePolyfills from 'rollup-plugin-polyfill-node'
import pkg from './package.json'
import replace from '@rollup/plugin-replace'
import rollup from './rollup.module.config.js'

export default Object.assign({}, rollup, {
  external: [], // no externals, bundle everything!
  output: [
    {
      format: 'cjs',
      exports: 'default',
      file: 'dist/cjs/index.bundle.js'
    },
    {
      format: 'es',
      file: 'dist/es/index.bundle.js'
    },
    {
      format: 'umd',
      name: pkg.moduleName,
      file: 'dist/umd/index.bundle.js'
    }
  ],
  plugins: [...rollup.plugins,
    nodePolyfills()
  ]
})
