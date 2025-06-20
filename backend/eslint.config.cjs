const js = require('@eslint/js')
const globals = require('globals')
const eslintPluginPrettier = require('eslint-plugin-prettier')

module.exports = [
  { ignores: ['dist', 'build', 'node_modules'] },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: {
        ...globals.node
      }
    },
    plugins: {
      'prettier': eslintPluginPrettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { 
        varsIgnorePattern: '^(?:[A-Z_])',
        argsIgnorePattern: '^(?:[A-Z_])',
        caughtErrorsIgnorePattern: '^_'
      }], 

    },
  },
  // for test file (Jest/Supertest)
  {
    files: ['**/*.test.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: {
        ...globals.node,
        ...globals.jest, // includes describe, it, test, expect, beforeEach, etc.
      },
    },
  },
]
