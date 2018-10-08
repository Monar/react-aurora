module.exports = {
  variants: {
    es5: {
      steps: [
        'npm run build:es5',
      ],

    },
    es6: {
      suffix: '-es6',
      tag: 'es6',
      steps: [
        'npm run build:es6',
      ],
    },
  },
}
