// bootstrap.mjs
import babelRegister from '@babel/register';

babelRegister({
  presets: ['@babel/preset-env', '@babel/preset-react'],
  extensions: ['.js', '.mjs', '.jsx', '.ts', '.tsx'],
  // Any additional Babel configuration can be included here.
});

import('./cli-app.mjs').catch(error => {
  console.error('Error loading cli-app.mjs:', error);
});