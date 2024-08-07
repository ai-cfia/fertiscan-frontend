module.exports = {
    presets: [
      '@babel/preset-env', // This preset compiles modern JavaScript down to ES5
      '@babel/preset-react' // This preset adds support for JSX
    ],
    plugins: [
      // List of Babel plugins you want to use
    ],
    comments: true // Preserve comments in output
  };

// need to install : npm install --save-dev @babel/core @babel/preset-env @babel/preset-react