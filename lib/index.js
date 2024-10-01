module.exports = {
  rules: {
    'require-lean': require('./rules/require-lean'),
    'no-model-direct-access': require('./rules/no-model-direct-access'),
    'avoid-direct-save': require('./rules/avoid-direct-save'),
  },
};
