import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@Base/service';
import { InjectEntityModel } from '@midwayjs/orm';
import { SysUserRoleEntity } from '@Root/app/module/base/entity/sys/user_role';
import { Repository } from 'typeorm';
import { isEmpty } from 'lodash';

/**
 * 角色
 */
@Provide()
export class SysRoleService extends BaseService {
  @InjectEntityModel(SysUserRoleEntity)
  sysRoleEntity: Repository<SysUserRoleEntity>;

  /**
   * 根据用户ID获得所有用户角色
   * @param userId
   */
  async getByUser(userId: number): Promise<number[]> {
    const userRole = await this.sysRoleEntity.find({ userId });
    if (!isEmpty(userRole)) {
      return userRole.map(e => {
        return e.roleId;
      });
    }
    return [];
  }
}
