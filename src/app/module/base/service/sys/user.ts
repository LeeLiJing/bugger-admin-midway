import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@Base/service';
import { InjectEntityModel } from '@midwayjs/orm';
import { SysUserEntity } from '@Root/app/module/base/entity/sys/user';
import { Repository } from 'typeorm';

/**
 * 系统用户
 */
@Provide()
export class SysUserService extends BaseService {
  @InjectEntityModel(SysUserEntity)
  sysUserEntity: Repository<SysUserEntity>;

  /**
   * 获得个人信息
   */
  async getPersonInfo() {
    const info = await this.sysUserEntity.findOne({ id: this.ctx.admin.userId });
    delete info.password;
    return info;
  }
}
