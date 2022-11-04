const CracoAlias = require('craco-alias')

module.exports = {
  webpack: {
    configure: webpackConfig => {
      webpackConfig.resolve.alias = {
        '@mui/styled-engine': '@mui/styled-engine-sc',
      }
      webpackConfig.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
      }

      webpackConfig.module.rules.push({
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      })

      return webpackConfig
    },
  },
}
