import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
//import prettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import cypress from 'eslint-plugin-cypress'

export default [
  { ignores: ['dist', 'build'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'prettier': eslintPluginPrettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { 
        varsIgnorePattern: '^(?:[A-Z_])',
        argsIgnorePattern: '^(?:[A-Z_])',
        caughtErrorsIgnorePattern: '^_'
      }], // original regex match ^[A-Z_]
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
     // 'prettier/prettier': 'error'
    },
  },
  // for cypress
  {
    files: ['cypress/e2e/**/*.cy.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
        ...globals.chai,
        ...globals.cypress,
      },
    },
    plugins: {
      cypress: cypress,
    },
    rules: {
      ...cypress.configs.recommended.rules,
      'no-unused-vars': ['error', { 
        varsIgnorePattern: '^(?:[A-Z_])',
        argsIgnorePattern: '^(?:[A-Z_])',
        caughtErrorsIgnorePattern: '^_'
      }],
    },
  },
]
