// no-direct-model-access.js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow direct access to Mongoose models',
      category: 'Best Practices',
      recommended: false,
    },
    messages: {
      noModelAccess:
        'Direct model access is prohibited. Use repository methods instead.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          modelImportPaths: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of import paths that represent Mongoose models',
          },
          modelVariableNames: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of variable names representing Mongoose models',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    // Retrieve options if provided
    const options = context.options[0] || {};
    const modelImportPaths = options.modelImportPaths || [
      'models/',
      './models/',
      '../models/',
      '@entities/ModuleSystem/',
    ];
    const modelVariableNames = new Set(options.modelVariableNames || []);

    // Helper function to check if a path matches any of the model import paths
    function isModelImportPath(importPath) {
      return modelImportPaths.some((path) => importPath.startsWith(path));
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        if (isModelImportPath(importPath)) {
          node.specifiers.forEach((specifier) => {
            if (
              specifier.type === 'ImportDefaultSpecifier' ||
              specifier.type === 'ImportSpecifier' ||
              specifier.type === 'ImportNamespaceSpecifier'
            ) {
              modelVariableNames.add(specifier.local.name);
            }
          });
        }
      },
      VariableDeclarator(node) {
        // Handle CommonJS require statements
        if (
          node.init &&
          node.init.type === 'CallExpression' &&
          node.init.callee.name === 'require' &&
          node.init.arguments.length === 1 &&
          ((node.init.arguments[0].type === 'Literal' &&
            typeof node.init.arguments[0].value === 'string' &&
            isModelImportPath(node.init.arguments[0].value)) ||
            (node.init.arguments[0].type === 'TemplateLiteral' &&
              node.init.arguments[0].quasis.some((quasi) =>
                modelImportPaths.some((path) =>
                  quasi.value.raw.startsWith(path)
                )
              )))
        ) {
          // Example: const User = require('@entities/ModuleSystem/UserModel');
          if (node.id.type === 'Identifier') {
            modelVariableNames.add(node.id.name);
          } else if (node.id.type === 'ObjectPattern') {
            node.id.properties.forEach((property) => {
              if (
                property.type === 'Property' &&
                property.value.type === 'Identifier'
              ) {
                modelVariableNames.add(property.value.name);
              }
            });
          }
        }
      },
      MemberExpression(node) {
        // Check if the object of the member expression is a model variable
        if (
          node.object &&
          node.object.type === 'Identifier' &&
          modelVariableNames.has(node.object.name)
        ) {
          // Optionally, you can further check if the property is a disallowed method
          // For now, any member access is disallowed
          context.report({
            node,
            messageId: 'noModelAccess',
          });
        }
      },
    };
  },
};
