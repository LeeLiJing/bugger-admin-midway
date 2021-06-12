import { App, Configuration } from '@midwayjs/decorator';
import { ILifeCycle, IMidwayContainer } from '@midwayjs/core';
import { IMidwayWebApplication } from '@midwayjs/web';
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

  // 应用启动完成
  async onReady(container?: IMidwayContainer) {
  }

  // 应用停止
  async onStop() {
  }
}
