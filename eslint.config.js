// Import the recommended ESLint configuration for JavaScript
// Import the recommended ESLint configuration for JavaScript
const js = require('@eslint/js');
// Import predefined global variables for different environments
const globals = require('globals');

module.exports = [
  // Use the recommended ESLint configuration as a base
  js.configs.recommended,
  {
    // Apply this configuration to all JavaScript files
    files: ['**/*.js'],
    languageOptions: {
      // Use the latest ECMAScript version
      ecmaVersion: 'latest',
      // Treat files as ES modules
      sourceType: 'module',
      // Combine global variables from both browser and Node.js environments
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    // Override default rules
    rules: {
      // Allow the use of console.log and other console methods
      'no-console': 'off'
    }
  }
];
