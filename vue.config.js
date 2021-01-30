const webpack = require('webpack');

module.exports = {
  
  configureWebpack: {
    // Set up all the aliases we use in our app.
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 6
      })
    ]
  },
  pwa: {
    name: 'Codenames',
    themeColor: '#4e54c8',
    msTileColor: '#4e54c8',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: '#4e54c8'
  },
  css: {
    // Enable CSS source maps.
    sourceMap: process.env.NODE_ENV !== 'production'
  }
};
