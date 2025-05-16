import type { Preview } from '@storybook/react'
import theme from './Theme'
const preview: Preview = {
  parameters: {
    docs: {
      theme,
    },
    codesandbox: {
      /**
       * @required
       * Workspace API key from codesandbox.io/t/permissions.
       * This sandbox is created inside the given workspace
       * and can be shared with team members.
       */
      // @ts-expect-error (2339) Property 'env' does not exist on type 'ImportMeta'.
      apiToken: import.meta.env.STORYBOOK_CODESANDBOX_TOKEN,
 
      /**
       * @required
       * Dependencies list to be installed in the sandbox.
       *
       * @note You cannot use local modules or packages since
       * this story runs in an isolated environment (sandbox)
       * inside CodeSandbox. As such, the sandbox doesn't have
       * access to your file system.
       *
       * Example:
       */
      dependencies: {
        "render-hooks": "latest",
        "react": "latest",
        "react-dom": "latest",
      },
 
      /**
       * @required
       * CodeSandbox will try to import all components by default from
       * the given package, in case `mapComponent` property is not provided.
       *
       * This property is useful when your components imports are predictable
       * and come from a single package and entry point.
       */
      fallbackImport: "render-hooks",
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;