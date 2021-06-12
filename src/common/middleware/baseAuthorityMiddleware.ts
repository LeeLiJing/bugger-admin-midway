import { Config, Inject, Provide } from '@midwayjs/decorator';
import { IMidwayWebNext, IWebMiddleware, MidwayWebMiddleware } from '@midwayjs/web';
import { Context } from 'egg';
import { ICoreConfig, ResOp } from '@Root/interface';
import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';
import { Utils } from '@Base/utils';

/**
 * 权限校验
 * */
@Provide()
export class BaseAuthorityMiddleware implements IWebMiddleware {
  @Config('CoreConfig')
  coreConfig: ICoreConfig;

  @Inject()
  utils: Utils;

  baseCache;

  resolve(): MidwayWebMiddleware {
    return async (ctx: Context, next: IMidwayWebNext) => {
      let { url } = ctx;
      const { prefix } = this.coreConfig.router;
      url = url.replace(prefix, '');
      const token = ctx.get('Authorization');
      const adminUrl = '/admin/';
      // 路由地址为 admin 前缀的 需要权限校验
      if (_.startsWith(url, adminUrl)) {
        try {
          ctx.admin = jwt.verify(token, this.coreConfig.jwt.secret);
        } catch (err) {
          // 不需要登录 无需权限校验
          if (new RegExp(`${adminUrl}?.*/public/`).test(url)) {
            await next();
            return;
          }

          if (ctx.admin) {
            // 超管拥有所有权限
            if (ctx.admin.username === 'admin' && !ctx.admin.isRefresh) {
              await next();
              return;
            }
          }

          // 需要登录每个人都有都权限接口
          if (new RegExp(`^${adminUrl}?.*/comm.`).test('url')) {
            await next();
            return;
          }

          // 如果床的token是refreshToken则校验失败
          if (ctx.admin.isRefresh) {
            this.reject(ctx, { code: 11001 });
            return;
          }

          // 需要动态获得缓存
          this.baseCache = await ctx.requestContext.getAsync('admin:cache');

          //判断密码版本是否正确
          const passwordV = await this.baseCache.get(`admin:passwordVersion:${ctx.admin.uid}`);
          if (passwordV != ctx.admin.passwordVersion) {
            this.reject(ctx, { code: 11001 });
            return;
          }

          const rToken = await this.baseCache.get(`admin:token:${ctx.admin.uid}`);
          if (!rToken) {
            this.reject(ctx, { code: 11001 });
            return;
          }

          if(rToken !== token && this.coreConfig.sso){

          }
        }
      }
      await next();
    };
  }

  reject(ctx: Context, op: ResOp): void {
    ctx.status = 200;
    ctx.body = this.utils.res(op);
  }
}
