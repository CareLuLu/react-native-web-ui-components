module.exports = {
  plugins: [
    ['lodash', { id: ['lodash'] }],
    '@babel/plugin-transform-react-jsx',
    '@babel/plugin-proposal-class-properties',
  ],
  env: {
    test: {
      presets: [
        'module:metro-react-native-babel-preset',
      ],
    },
  },
};
