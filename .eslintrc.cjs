module.exports = {
  extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', 'prettier'],
  plugins: ['vue'],
  rules: {
    semi: ['error', 'always'],
    indent: ['error', 2],
    quotes: ['error', 'single'],
    'no-console': 'warn',
    'no-trailing-spaces': 'error',
    'arrow-spacing': ['error', { before: true, after: true }],
    'vue/require-default-prop': 'off',
    'no-console': ['error', { allow: ['error'] }],
  },
};
