// See http://brunch.io for documentation.
const commonRequireDefinition = require('commonjs-require-definition');

exports.config = {
  files: {
    javascripts: {
      joinTo: {
        'app.js': /^(node_modules|app\/.*\.(?:gl|js))/,
        'worker.js': ['app/chunk.js', 'app/complex.js', 'app/worker.js']
      },
      order: {
        after: [/\.gl$/]
      }
    },
    stylesheets: {joinTo: 'app.css'}
  },
  modules: {
    wrapper: (path, data) => {
      if(path === 'worker.js')
        return data
      else
        return {
          prefix: `require.define({'${path}': function(exports, require, module) {`,
          data: data,
          suffix: '}});'
        }
    }
  },
  plugins: {
    text: {
      pattern: /\.gl$/
    },
    babel: { }
  },
  npm: {
    enabled: true,
    detectProcess: false
  }
};
