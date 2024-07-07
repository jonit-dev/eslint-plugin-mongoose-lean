module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Ensure Mongoose queries use lean() and avoid direct .save()",
      category: "Best Practices",
      recommended: true,
    },
    fixable: "code",
    schema: [],
  },
  create: function (context) {
    function checkForLean(node) {
      let current = node;
      while (current.parent) {
        if (current.type === "CallExpression" && 
            current.callee.type === "MemberExpression" && 
            current.callee.property.name === "lean") {
          return true;
        }
        current = current.parent;
      }
      return false;
    }

    return {
      CallExpression(node) {
        try {
          if (node.callee.type === "MemberExpression" &&
              ["find", "findOne", "findById"].includes(node.callee.property.name) &&
              node.callee.object.type === "Identifier") {
            
            if (!checkForLean(node)) {
              context.report({
                node,
                message: "Mongoose query is missing lean()",
                fix(fixer) {
                  return fixer.insertTextAfter(node, ".lean()");
                },
              });
            }
          }

          // Check for .save() usage
          if (node.callee.type === "MemberExpression" &&
              node.callee.property.name === "save") {
            context.report({
              node,
              message: "Avoid using .save() directly. Consider using updateOne() or findOneAndUpdate() instead.",
            });
          }
        } catch (error) {
          console.error("Error processing node:", error);
        }
      },
    };
  },
};
