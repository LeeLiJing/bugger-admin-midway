import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { ICoreConfig } from '@Root/interface';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1623317016696_8874';

  // add your config here
  config.middleware = [ 'baseAuthorityMiddleware' ];

  // 关闭安全校验
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    }
  };

  config.CoreConfig = {
    router: {
      prefix: ''
    },
    sso: false,
    jwt: {
      secret: 'INnyQ50BEE6AITQraIaDGooJ',
      token: {
        // 2个小时过期，需要用刷新token
        expire: 2 * 60 * 60,
        // 15天内如果没有操作过就需要重新登录
        refreshExpire: 60 * 60 * 24 * 15
      }
    },
    // 分页配置
    page: {
      // 分页产讯每页条数
      size: 15
    }
  } as ICoreConfig;

  config.midwayFeature = {
    replaceEggLogger: true
  };

  config.multipart = {
    mode: 'file'
  };

  return config;
};
