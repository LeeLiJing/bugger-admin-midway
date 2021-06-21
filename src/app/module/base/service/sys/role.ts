import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@Base/service';
import { InjectEntityModel } from '@midwayjs/orm';
import { SysUserRoleEntity } from '@Root/app/module/base/entity/sys/user_role';
import { Repository, Brackets } from 'typeorm';
import { isEmpty } from 'lodash';
import { SysRoleEntity } from '@Root/app/module/base/entity/sys/role';

/**
 * 角色
 */
@Provide()
export class SysRoleService extends BaseService {
  @InjectEntityModel(SysUserRoleEntity)
  sysUserRoleEntity: Repository<SysUserRoleEntity>;

  @InjectEntityModel(SysRoleEntity)
  sysRoleEntity: Repository<SysRoleEntity>;

  /**
   * 根据用户ID获得所有用户角色
   * @param userId
   */
  async getByUser(userId: number): Promise<number[]> {
    const userRole = await this.sysUserRoleEntity.find({ userId });
    if (!isEmpty(userRole)) {
      return userRole.map(e => {
        return e.roleId;
      });
    }
    return [];
  }

  async page() {
    return this.sysRoleEntity
      .createQueryBuilder()
      .where(new Brackets(qg => {
        qg.where('id != :id', { id: 1 });
        if (this.ctx.admin.username !== 'admin') {
          qg.andWhere('(userId=:userId or id in (:roleId))', {
            userId: this.ctx.admin.userId,
            roleId: this.ctx.admin.roleIds
          });
        }
      }))
      .getMany();
  }
}
