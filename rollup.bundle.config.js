import pkg from './package.json'
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
  ]
})
