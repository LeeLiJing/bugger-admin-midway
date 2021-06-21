import { Controller, Inject, Post, Provide } from '@midwayjs/decorator';
import { BaseController } from '@Base/controller';
import { SysRoleService } from '@Root/app/module/base/service/sys/role';
import { ResOp } from '@Root/interface';

@Provide()
@Controller('/admin/sys/role')
export class SysRoleController extends BaseController {
  @Inject()
  sysRoleService: SysRoleService;

  @Post('/page')
  async page(): Promise<ResOp> {
    return this.ok({
      data: await this.sysRoleService.page()
    });
  }
}
