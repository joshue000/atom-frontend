import pkg from '../../package.json';

export const environment = {
  production: false,
  version: pkg.version,
  apiUrl: 'https://southamerica-east1-atom-task-manager-2026.cloudfunctions.net/api/api',
};
