## Local Development and Testing of `eslint-plugin-mongoose-performance`

This guide will help you set up, test, and finally publish `eslint-plugin-mongoose-performance` for use in your projects.

### Prerequisites

- Yarn installed globally
- ESLint properly set up in your project
- Node.js environment
- npm account with a valid authentication token

### Testing your changes locally

To test your changes in a real project without publishing the package to npm, you can link the plugin locally using Yarn’s `link` feature.

#### Step 1: Link the Plugin

Inside the `eslint-plugin-mongoose-performance` plugin directory, run the following command:

```bash
yarn link
```

This will create a symbolic link in your global Yarn directory, allowing other projects to use this local version of the plugin.

#### Step 2: Link the Plugin in Your Project

Now, in the project where you want to test the ESLint plugin, run:

```bash
yarn link "eslint-plugin-mongoose-performance"
```

This will create a symbolic link in your project, pointing to the local version of the plugin.

#### Step 3: Update ESLint Configuration

To use your custom plugin, update your `.eslintrc.js` (or equivalent ESLint configuration file) in the project where you want to test the plugin:

```js
module.exports = {
  plugins: ['mongoose-performance'], // Reference the plugin without the 'eslint-plugin-' prefix

  rules: {
    'mongoose-performance/your-rule-name': 'error', // Replace 'your-rule-name' with your custom rule
  },
};
```

### Running ESLint with the Plugin

After linking the plugin and updating your ESLint configuration, run ESLint in your project to test the plugin:

```bash
yarn eslint . --ext .js,.ts
```

This will apply the custom rules defined in `eslint-plugin-mongoose-performance`.

### Updating the Plugin

If you make updates to the plugin source code while testing, changes will automatically be reflected in the linked project because the link points to the plugin's source folder.

### Unlinking the Plugin

When you are done testing your plugin locally, you can unlink it from your project to restore the original state.

In the project where you linked the plugin, run:

```bash
yarn unlink "eslint-plugin-mongoose-performance"
```

This will remove the symbolic link to the local plugin.

If needed, you can also unlink the global link by running the following command inside the plugin directory:

```bash
yarn unlink
```

### Publishing the Plugin

After completing the development and testing of your `eslint-plugin-mongoose-performance` plugin, you can publish it to npm for broader usage.

#### Step 1: Set Up npm Authentication

To publish the package, ensure that you have your npm token properly configured in a `.npmrc` file. You can generate an authentication token from the npm website by logging in to your account.

Create or update your `.npmrc` file with the following content:

```bash
//registry.npmjs.org/:_authToken=YOUR_NPM_TOKEN_HERE
```

Replace `YOUR_NPM_TOKEN_HERE` with your actual npm authentication token.

#### Step 2: Publish to npm

Once the `.npmrc` file is properly set up and you’ve finalized the plugin, you can publish it to npm by running:

```bash
yarn publish
```

This will push your plugin to the npm registry. After publishing, others can install and use it directly via npm or Yarn:

```bash
yarn add eslint-plugin-mongoose-performance
```

### 6. Troubleshooting

- **ESLint Cache Issues**: If changes are not reflecting, try clearing the ESLint cache by running:

  ```bash
  yarn eslint . --ext .js,.ts --no-cache
  ```

- **Editor Issues**: Some editors may cache ESLint rules. Try restarting your editor/IDE if changes are not reflecting.

- **npm Authentication**: If you encounter authentication issues during publishing, ensure your `.npmrc` is correctly set up and that the token is valid.
