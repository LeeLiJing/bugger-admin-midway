import { Controller, Inject, Post, Provide } from '@midwayjs/decorator';
import { ResOp } from '@Root/interface';
import { BaseController } from '@Base/controller';
import { SysMenuService } from '@Root/app/module/base/service/sys/menu';

@Provide()
@Controller('/admin/sys/menu')
export class SysMenuController extends BaseController {
  @Inject()
  sysMenuService: SysMenuService;

  /**
   * 获得所有菜单
   */
  @Post('/list')
  async getList(): Promise<ResOp> {
    return this.ok({
      data: await this.sysMenuService.getList()
    });
  }
}
