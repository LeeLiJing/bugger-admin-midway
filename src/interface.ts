/**
 * @description User-Service parameters
 */
export interface ResOp {
  data?: any;
  code?: number;
  message?: string;
}

export interface ICoreConfig {
  router: {
    prefix: string;
  };
  sso: boolean,
  page: {
    size: number;
  };
  jwt: {
    secret: string;
    token: {
      expire: number;
      refreshExpire: number;
    };
  };
}

