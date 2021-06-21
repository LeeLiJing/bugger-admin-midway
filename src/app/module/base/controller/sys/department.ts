import { Controller, Inject, Post, Provide } from '@midwayjs/decorator';
import { BaseController } from '@Base/controller';
import { SysDepartmentService } from '@Root/app/module/base/service/sys/department';
import { ResOp } from '@Root/interface';

@Provide()
@Controller('/admin/sys/department')
export class SysDepartmentController extends BaseController {
  @Inject()
  sysDeptService: SysDepartmentService;

  /**
   * 获得部门菜单
   */
  @Post('/list')
  async getList(): Promise<ResOp> {
    return this.ok({
      data: await this.sysDeptService.list()
    });
  }
}
