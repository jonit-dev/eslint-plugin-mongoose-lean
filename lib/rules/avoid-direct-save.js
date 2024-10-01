module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Avoid using .save() directly. Consider using .create() for create operations, updateOne(), findOneAndUpdate(), or other appropriate methods instead.',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
  },
  create: function (context) {
    return {
      CallExpression(node) {
        if (
          node.callee.object &&
          node.callee.object.name &&
          node.callee.property.name === 'save'
        ) {
          context.report({
            node,
            message:
              'Avoid using .save() directly. Consider using .create() for create operations, updateOne(), findOneAndUpdate(), or other appropriate methods instead.',
          });
        }
      },
    };
  },
};
