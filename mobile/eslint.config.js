// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['node_modules/*', 'android/*', 'ios/*', '.expo/*', 'scripts/*', 'eslint-report.json'],
  },
  {
    rules: {
      // Faz 0 başlangıç çizgisi: aşağıdaki kurallar mevcut kodda yaygın ihlalli
      // (react-hooks v6'nın yeni katı kuralları). Hata seli yaratmamak için warn;
      // K6 god-file bölme/refactor işinde error'a geri yükseltilecek.
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react/no-unescaped-entities': 'warn',
    },
  },
]);
