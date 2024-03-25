const { whenDev } = require('@craco/craco');

module.exports = {
  webpack: {
    module: {
      rules: [
        // ... (other rules)
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.entry = {
        main: [
          whenDev(() => require.resolve('react-dev-utils/webpackHotDevClient')),
          paths.appIndexJs,
        ].filter(Boolean),
        content: './src/chromeServices/DOMEvaluator.tsx',
        background: './src/background/background.ts', // Your background script
      };

      webpackConfig.output = {
        ...webpackConfig.output,
        filename: 'static/js/[name].js',
      };

      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        runtimeChunk: false,
      };

      return webpackConfig;
    },
  },
};
