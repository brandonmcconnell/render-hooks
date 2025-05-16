import type { Preview } from '@storybook/react'

const preview: Preview = {
  parameters: {
    codesandbox: {
      /**
       * @required
       * Workspace API key from codesandbox.io/t/permissions.
       * This sandbox is created inside the given workspace
       * and can be shared with team members.
       */
      apiToken: import.meta.env.STORYBOOK_CODESANDBOX_TOKEN!,
 
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
        "@radix-ui/themes": "latest",
      },
 
      /**
       * @required
       * CodeSandbox will try to import all components by default from
       * the given package, in case `mapComponent` property is not provided.
       *
       * This property is useful when your components imports are predictable
       * and come from a single package and entry point.
       */
      fallbackImport: "@radix-ui/themes",
 
      /**
       * @optional
       * All required providers to run the sandbox properly,
       * such as themes, i18n, store, and so on.
       *
       * @note Remember to use only the dependencies listed above.
       *
       * Example:
       */
      provider: `import { Theme } from "@radix-ui/themes";
        import '@radix-ui/themes/styles.css';
 
        export default ThemeProvider = ({ children }) => {
          return (
            <Theme>
              {children}
            </Theme>
          )
        }`,
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