module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/recommended'
  ],
  parserOptions: {
    'parser': 'babel-eslint',
    'ecmaVersion': 2017,
    'sourceType': 'module'
  },
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    'indent': ['error', 2],
    'keyword-spacing': 2,
    'space-infix-ops': 2,
    'space-before-blocks': 2,
    'semi': 2,
    'no-var': 2,
    'no-tabs': 2
  }
}
