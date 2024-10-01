module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure Mongoose queries use lean()',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
  },
  create: function (context) {
    function checkForLean(node) {
      let current = node;
      while (current.parent) {
        if (
          current.type === 'CallExpression' &&
          current.callee.type === 'MemberExpression' &&
          current.callee.property.name === 'lean'
        ) {
          return true;
        }
        current = current.parent;
      }
      return false;
    }

    return {
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression' &&
          ['find', 'findOne', 'findById'].includes(node.callee.property.name) &&
          node.callee.object.type === 'Identifier'
        ) {
          if (!checkForLean(node)) {
            context.report({
              node,
              message: 'Mongoose query is missing lean()',
              fix(fixer) {
                return fixer.insertTextAfter(node, '.lean()');
              },
            });
          }
        }
      },
    };
  },
};
