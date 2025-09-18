/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-refresh'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-refresh/recommended',
    'prettier'
  ],
  env: { browser: true, es2022: true, node: true },
  ignorePatterns: ['dist', 'node_modules'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }] }
};

