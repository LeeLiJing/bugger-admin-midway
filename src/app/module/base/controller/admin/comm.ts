import { Controller, Get, Inject, Provide } from '@midwayjs/decorator';
import { BaseController } from '@Base/controller';
import { SysUserService } from '@Root/app/module/base/service/sys/user';
import { ResOp } from '@Root/interface';

/**
 * Base 通用接口 一般写不需要权限过滤的接口
 */
@Provide()
@Controller('/admin/comm')
export class CommonController extends BaseController {
  @Inject()
  sysUserService: SysUserService;

  /**
   * 获得个人信息
   */
  @Get('/person')
  async getPerson(): Promise<ResOp> {
    return this.ok({
      data: await this.sysUserService.getPersonInfo()
    });
  }
}
