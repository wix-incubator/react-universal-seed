
const rootDir = './dist/src';
require('css-modules-require-hook')({
  rootDir,
  generateScopedName: '[path][name]__[local]__[hash:base64:5]',
  extensions: ['.scss', '.css'],
  camelCase: true
});

const server = require('./dist/src/server');
server({baseURL: 'http://localhost:3000/'}).listen(3000); //TODO: fix
