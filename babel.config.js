module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'react-native-web' }],
    ],
    plugins: [
      // Required for expo-router
      'expo-router/babel',
      // Required for react-native-reanimated - MUST BE LAST
      'react-native-reanimated/plugin',
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};
