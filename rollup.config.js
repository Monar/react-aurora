import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/react-aurora.js',
    name: 'Aurora',
    format: 'umd',
    globals: {
      'prop-types': 'PropTypes',
      react: 'React',
    },
  },
  external: ['react', 'prop-types'],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    resolve({
      customResolveOptions: {
        moduleDirectory: 'js_modules',
      },
    }),
  ],
};
