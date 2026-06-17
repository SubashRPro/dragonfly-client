import { Environment } from '@delon/theme';

export const environment = {
  production: true,
  useHash: true,
  api: {
    baseUrl: 'http://18.171.98.145:5843',
    codeUrl: 'http://18.171.98.145:5843',
    userUrl: 'http://18.171.98.145:5843',
    clientUrl: 'https://my.dragonflyfx.com',
    calculatorUrl: 'test.com',
    fileUrl: 'https://files.dragonflyfx.com/',
    ecUrl: 'test.com',
    crmUrl: 'https://crm.dragonflyfx.com/',
    webUrl: 'https://dragonflyfx.com',
    ibUrl: 'https://partners.dragonflyfx.com',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh'
  },
} as Environment;
