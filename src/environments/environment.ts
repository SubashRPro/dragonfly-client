import { Environment } from '@delon/theme';

export const environment = {
  production: true,
  useHash: true,
  api: {
    baseUrl: 'https://globalportal-api.trive.com',
    codeUrl: 'https://globalportal-api.trive.com',
    userUrl: 'https://globalportal-api.trive.com',
    clientUrl: 'https://global-int.trive.com',
    calculatorUrl: 'test.com',
    fileUrl: 'https://kyc-upload.trive.com',
    ecUrl: 'test.com',
    crmUrl: 'https://globalcrm.trive.com/',
    webUrl: 'https://www.trive.com',
    ibUrl: 'https://global-intib.trive.com',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh'
  },
} as Environment;
