import { Environment } from '@delon/theme';

export const environment = {
  production: true,
  useHash: true,
  api: {
    baseUrl: 'http://18.171.98.145:5843',
    codeUrl: 'http://18.171.98.145:5843',
    userUrl: 'http://18.171.98.145:5843',
    clientUrl: 'http://18.171.98.145:5843',
    calculatorUrl: 'http://18.171.98.145:5843',
    fileUrl: 'http://18.171.98.145:5843',
    ecUrl: 'test.com',
    crmUrl: 'test.com',
    webUrl: 'test.com',
    ibUrl: 'test.com',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh'
  },
} as Environment;
