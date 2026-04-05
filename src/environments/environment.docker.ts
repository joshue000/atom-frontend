import pkg from '../../package.json';

export const environment = {
  production: false,
  version: pkg.version,
  apiUrl: 'http://localhost:3000/api',
};
