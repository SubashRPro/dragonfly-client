import { Environment } from '@delon/theme';

export const environment = {
  production: true,
  useHash: true,
  api: {
    baseUrl: 'https://clientapi.dragonflyfx.com',
    codeUrl: 'https://clientapi.dragonflyfx.com',
    userUrl: 'https://clientapi.dragonflyfx.com',
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
