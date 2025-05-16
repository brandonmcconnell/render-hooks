import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@chromatic-com/storybook"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  "typescript": {
    "reactDocgen": "react-docgen-typescript",
    "reactDocgenTypescriptOptions": {
      // You might need to specify compilerOptions here if they differ from your main tsconfig
      // For example, to ensure JSX is handled correctly:
      // compilerOptions: {
      //   jsx: "react-jsx", // or "react"
      // },
      // Filter props from node_modules (optional, but good practice)
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
      // If your components are not directly in `src` or you have a specific tsconfig for app compilation:
      // tsconfigPath: "./tsconfig.app.json", // Or your relevant tsconfig
    }
  }
};
export default config;