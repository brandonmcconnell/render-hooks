import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'; // Required for Vitest to process React components

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom', // or 'jsdom'
    setupFiles: './vitest.setup.ts', // Optional: if you need setup files
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/index.{ts,tsx}', // Usually, the main export file doesn't need direct coverage if its parts are tested
        'vitest.config.ts',
        'vitest.setup.ts',
      ],
    },
  },
}); 