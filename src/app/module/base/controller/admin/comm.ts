import { Controller, Get, Inject, Provide } from '@midwayjs/decorator';
import { BaseController } from '@Base/controller';
import { SysUserService } from '@Root/app/module/base/service/sys/user';
import { ResOp } from '@Root/interface';
import { SysPermsService } from '@Root/app/module/base/service/sys/perms';

/**
 * Base 通用接口 一般写不需要权限过滤的接口
 */
@Provide()
@Controller('/admin/comm')
export class CommonController extends BaseController {
  @Inject()
  sysUserService: SysUserService;

  @Inject()
  sysPermsService: SysPermsService;

  /**
   * 获得个人信息
   */
  @Get('/person')
  async getPerson(): Promise<ResOp> {
    return this.ok({
      data: await this.sysUserService.getPersonInfo()
    });
  }

  /**
   * 权限菜单
   */
  @Get('/permmenu')
  async permmenu(): Promise<ResOp> {
    return this.ok({
      data: this.sysPermsService.permmenu(this.ctx.admin.roleIds)
    });
  }
}
