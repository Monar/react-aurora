import babel from 'rollup-plugin-babel';
import { cjsConfig, esConfig } from './base';

const babelPlugin = babel({
  babelrc: false,
  presets: [['@babel/env', { modules: false }]],
  exclude: 'node_modules/**'
});

export default [
  {
  ...cjsConfig,
    plugins: [babelPlugin],
  },
  {
    ...esConfig,
    plugins: [babelPlugin],
  }
];

