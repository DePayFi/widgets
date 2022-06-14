const { defineConfig } = require('cypress')

module.exports = defineConfig({
  "video": false,
  "e2e": {
    "specPattern": "cypress/e2e/**/*.{js,jsx,ts,tsx}"
  }
})
