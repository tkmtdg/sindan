const path = require('path')
const {
  defineConfig
} = require('vite')

import eslintPlugin from 'vite-plugin-eslint';

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src', 'sindan.js'),
      name: 'Sindan',
      formats: ['umd'],
      fileName: (format) => `sindan.${format}.js`
    },
  },
  plugins: [eslintPlugin({
    fix: true
  })],
})
