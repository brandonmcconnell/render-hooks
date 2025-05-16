/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

// Extend the existing ImportMetaEnv interface with your custom variables
interface ImportMetaEnv {
  readonly STORYBOOK_CODESANDBOX_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
