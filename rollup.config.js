// rollup.config.js
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  input: 'index.js',
  output: {
    file: 'umd.js',
    format: 'umd',
    name: 'ColorString',
    exports: 'named'
  },
  plugins: [
    nodeResolve(),
    commonjs({ sourceMap: false })
  ]
}
