export default {
  themeConfig: {
    logo: {
      src: 'http://bit.ly/2N3Ye2L',
      width: 220,
    },
    mode: 'dark',
  },
  native: true,
  codeSandbox: false,
  notUseSpecifiers: true,
  filterComponents: files => files.filter(filepath => /\/[\w]*\.(js|jsx|ts|tsx)$/.test(filepath)),
};
