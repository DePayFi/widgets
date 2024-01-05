const { defineConfig } = require('cypress')
const webpack = require('@cypress/webpack-preprocessor')

module.exports = defineConfig({
  "video": false,
  "e2e": {
    "specPattern": "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      const options = {
        webpackOptions: require('./webpack.config.js'),
      };
      on('file:preprocessor', webpack(options));
    },
  }
})
