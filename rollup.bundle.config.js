import pkg from './package.json';
import rollup from './rollup.config.js';

export default Object.assign({}, rollup, {
  output: [
    {
      format: 'cjs',
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
    },
  ],
  external: [] // no externals, bundle everything
})
