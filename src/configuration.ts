import { App, Configuration, Logger } from '@midwayjs/decorator';
import { ILifeCycle, IMidwayContainer } from '@midwayjs/core';
import { IMidwayWebApplication } from '@midwayjs/web';
import { ILogger } from '@midwayjs/logger';
import { join } from 'path';
import * as orm from '@midwayjs/orm';
import * as cache from '@midwayjs/cache';


@Configuration({
  importConfigs: [ join(__dirname, './config') ],
  conflictCheck: true,
  imports: [ orm, cache ]
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: IMidwayWebApplication;

  @Logger()
  coreLogger: ILogger;

  // 应用启动完成
  async onReady(container?: IMidwayContainer) {
    this.handlerEx();
  }

  // 应用停止
  async onStop() {
  }

  // 处理异常
  handlerEx() {
    this.app.use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        this.coreLogger.error(err);
        ctx.body = {
          code: err.status,
          message: err.message
        };
      }
    });
  }

}
