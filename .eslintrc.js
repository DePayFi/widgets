module.exports = {
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  extends: [
  ],
  plugins: ['react-hooks'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['test/**/*'],
  rules: {
  },
}
