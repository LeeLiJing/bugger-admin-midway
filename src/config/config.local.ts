import { EggAppConfig, PowerPartial } from 'egg';

const redisStore = require('cache-manager-ioredis');

export type DefaultConfig = PowerPartial<EggAppConfig>

export default () => {
  const config = {} as DefaultConfig;

  config.orm = {
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'adminadmin',
    database: 'bugger-service',
    synchronize: true,
    logging: false
  };

  config.logger = {
    coreLogger: {
      consoleLevel: 'INFO'
    }
  };
  config.cache = {
    store: redisStore,
    options: {
      host: '127.0.0.1', // default value
      port: 6379, // default value
      db: 0,
      ttl: 60
    }
  };
  return config;
}
