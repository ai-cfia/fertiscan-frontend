// babel.config.js

module.exports = {
    // Presets define a collection of plugins.
    presets: [
      // @babel/preset-env for transforming ES6+ syntax
      ["@babel/preset-env", {
        // Use "usage" option to include polyfills
        // for the specific features used in your code
        useBuiltIns: "usage",
        // Specify your target environment here (defaults to > 0.5%, last 2 versions, Firefox ESR, not dead)
        targets: "> 0.25%, not dead",
        // Specify core-js version. Must match the version installed in your project.
        corejs: 3,
        // Enables transformation of ECMAScript modules to another module type.
        // Setting this to false will not transform modules.
        modules: false
      }],
      // @babel/preset-react for transforming JSX
      ["@babel/preset-react", {
        // Enable development mode for more helpful runtime checks in non-production code
        development: process.env.BABEL_ENV !== "production",
        // Use the new JSX transform introduced in React 17
        // (can be removed if React 17 is not applicable to your project)
        runtime: "automatic"
      }]
    ],
    // Plugins are JavaScript libraries that add additional transformations to Babel
    plugins: [
      // @babel/plugin-transform-runtime to reuse the Babel helpers
      // and save on code size.
      ["@babel/plugin-transform-runtime", {
        // Use regenerator runtime to enable async/await and generator support
        regenerator: true,
        // Specify core-js version. Must match the version installed in your project.
        corejs: 3
      }]
    ]
  };