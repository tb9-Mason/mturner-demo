import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import codegen from 'vite-plugin-graphql-codegen';
import type { CodegenConfig } from '@graphql-codegen/cli';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const CI_BUILD = !!process.env.CI;

  const config: CodegenConfig = {
    overwrite: true,
    schema: `${env.VITE_API_HOST}/graphql`,
    documents: ['src/**/*.tsx', 'src/**/*.queries.ts'],
    generates: {
      'src/gql/': {
        preset: 'client',
        presetConfig: {
          gqlTagName: 'gql',
        },
        plugins: [],
      },
      './graphql.schema.json': {
        plugins: ['introspection'],
      },
    },
    ignoreNoDocuments: true,
  };

  return {
    plugins: [react(), tailwindcss(), codegen({ config, runOnBuild: !CI_BUILD })],
    test: {
      globals: true,
      include: ['src/**/*.test.tsx'],
      exclude: ['src/gql/**'], // gql codegen
      coverage: {
        exclude: [
          'dist/**', // built files
          'src/gql/**', // gql codegen
          '**/*.config.{js,ts}', // config files
          '**/*.queries.ts', // query files
          '**/*.d.ts', // type files
        ],
      },
      parallel: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
    },
  };
});
