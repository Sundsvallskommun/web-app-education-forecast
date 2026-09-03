import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  globalIgnores(['.next/**', 'node_modules/**', 'coverage/**', 'cypress/**', '.jest/**']),
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      'react-hooks/incompatible-library': 'off',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]);
