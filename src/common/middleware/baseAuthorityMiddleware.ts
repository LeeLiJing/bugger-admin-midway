import { App, Config, Inject, Provide } from '@midwayjs/decorator';
import { IMidwayWebApplication, IMidwayWebNext, IWebMiddleware } from '@midwayjs/web';
import { ICoreConfig } from '@Root/interface';
import { Context } from 'egg';
import { startsWith } from 'lodash';
import * as jwt from 'jsonwebtoken';
import { CacheManager } from '@midwayjs/cache';
import { Redis } from 'ioredis';
import { isEmpty } from 'lodash';


/**
 * 权限校验
 */
@Provide()
export class BaseAuthorityMiddleware implements IWebMiddleware {
  @Config('CoreConfig')
  coreConfig: ICoreConfig;

  @Inject('cache:cacheManager')
  cacheManager: CacheManager;

  @App()
  app: IMidwayWebApplication;

  getCache(): Promise<Redis> {
    return (this.cacheManager.cache.store as any).getClient();
  }

  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      let statusCode = 200;
      let { url } = ctx;
      const { prefix } = this.coreConfig.router;
      url = url.replace(prefix, '');
      const token = ctx.get('Authorization');
      const adminUrl = '/admin/';
      // 路由地址为admin前缀的 需要权限校验
      if (startsWith(url, adminUrl)) {
        try {
          ctx.admin = jwt.verify(token, this.coreConfig.jwt.secret);
        } catch (err) {
        }

        // 不需要登录 无需权限校验
        if (new RegExp(`^${adminUrl}?.*/public/`).test(url)) {
          await next();
          return;
        }

        if (ctx.admin) {
          // 超管拥有所有权限
          if (ctx.admin.username === 'admin' && !ctx.admin.isRefresh) {
            await next();
            return;
          }

          // 要登录才有权限的接口
          if (new RegExp(`^${adminUrl}/?.*/comm/`).test(url)) {
            await next();
            return;
          }

          // 如果穿的token是refreshToken则校验失败
          if (ctx.admin.isRefresh) {
            ctx.status = 401;
            ctx.body = {
              code: 11002,
              message: '登录身份已过期'
            };
            return;
          }

          // 需要动态获取缓存
          const getCoreCache = await this.getCache();
          // 判断密码版本是否正确
          const passwordVersion = await getCoreCache.get(`admin:passwordVersion:${ctx.admin.userId}`);
          if (passwordVersion !== ctx.admin.passwordVersion) {
            ctx.status = 401;
            ctx.body = {
              code: 11002,
              message: '登录身份已过期'
            };
            return;
          }

          const rToken = await getCoreCache.get(`admin:token:${ctx.admin.userId}`);
          if (!rToken) {
            ctx.status = 401;
            ctx.body = {
              code: 11001,
              message: '登录失效或无权限访问'
            };
            return;
          }
          if (rToken !== token && this.coreConfig.sso) {
            statusCode = 401;
          } else {
            let perms = getCoreCache.get(`admin:perms:${ctx.admin.userId}`);
            if (isEmpty(perms)) {
              perms = JSON.parse(perms).map(e => {
                return e.replace(/:/g, '/');
              });
              if (!perms.includes(url.split('?')[0].replace('/admin/', ''))) {
                statusCode = 403;
              }
            } else {
              statusCode = 403;
            }
          }
        } else {
          statusCode = 401;
        }

        if (statusCode > 200) {
          ctx.status = statusCode;
          ctx.body = {
            code: 1001,
            message: '登录失效或无权限访问'
          };
          return;
        }
      }
      await next();
    };
  }
}
