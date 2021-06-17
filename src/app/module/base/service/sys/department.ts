import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@Base/service';
import { isEmpty, uniq } from 'lodash';
import { InjectEntityModel } from '@midwayjs/orm';
import { SysDepartmentEntity } from '@Root/app/module/base/entity/sys/department';
import { Repository } from 'typeorm';
import { SysRoleDepartmentEntity } from '@Root/app/module/base/entity/sys/role_department';

@Provide()
export class SysDepartmentService extends BaseService {
  @InjectEntityModel(SysDepartmentEntity)
  sysDepartmentEntity: Repository<SysDepartmentEntity>;

  @InjectEntityModel(SysRoleDepartmentEntity)
  sysRoleDepartmentEntity: Repository<SysRoleDepartmentEntity>;

  /**
   * 根据多个ID获得部门权限信息
   * @param {[]} roleIds 数组
   * @param isAdmin 是否超管
   */
  async getByRoleIds(roleIds: number[], isAdmin) {
    if (isEmpty(roleIds)) {
      if (isAdmin) {
        const result = await this.sysDepartmentEntity.find();
        return result.map(e => {
          return e.id;
        });
      }
      const result = await this.sysRoleDepartmentEntity
        .createQueryBuilder()
        .where('roleId in (:roleIds)', { roleIds })
        .getMany();

      if (!isEmpty(result)) {
        return uniq(result.map(e => {
          return e.departmentId;
        }));
      }
    }
    return [];
  }
}
