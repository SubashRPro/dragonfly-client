import { Environment } from '@delon/theme';

export const environment = {
  production: true,
  useHash: true,
  api: {
    baseUrl: 'https://globalportal-api.trive.com',
    codeUrl: 'https://globalportal-api.trive.com',
    userUrl: 'https://globalportal-api.trive.com',
    clientUrl: 'https://my.dragonflyfx.com',
    calculatorUrl: 'test.com',
    fileUrl: 'https://dragonfly-prod-bkt.s3.eu-west-2.amazonaws.com',
    ecUrl: 'test.com',
    crmUrl: 'https://crm.dragonflyfx.com/',
    webUrl: 'https://dragonflyfx.com',
    ibUrl: 'https://partners.dragonflyfx.com',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh'
  },
} as Environment;
