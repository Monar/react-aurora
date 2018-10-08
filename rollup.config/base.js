export const cjsConfig = {
  input: 'src/index.js',
  output: {
    file: 'lib/fetch-extended.cjs.js',
    format: 'cjs',
    exports: 'named',
  },
};

export const esConfig = {
  input: 'src/index.js',
  output: {
    file: 'lib/fetch-extended.js',
    format: 'es',
  },
};
