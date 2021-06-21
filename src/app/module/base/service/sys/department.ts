import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '@Base/service';
import { isEmpty, uniq } from 'lodash';
import { InjectEntityModel } from '@midwayjs/orm';
import { SysDepartmentEntity } from '@Root/app/module/base/entity/sys/department';
import { Repository } from 'typeorm';
import { SysRoleDepartmentEntity } from '@Root/app/module/base/entity/sys/role_department';
import { SysPermsService } from '@Root/app/module/base/service/sys/perms';

@Provide()
export class SysDepartmentService extends BaseService {
  @InjectEntityModel(SysDepartmentEntity)
  sysDepartmentEntity: Repository<SysDepartmentEntity>;

  @InjectEntityModel(SysRoleDepartmentEntity)
  sysRoleDepartmentEntity: Repository<SysRoleDepartmentEntity>;

  @Inject()
  sysPermsService: SysPermsService;

  /**
   * 获得部门菜单
   */
  async list() {
    // 部门权限
    const permsDepartmentArr = await this.sysPermsService.departmentIds(this.ctx.admin.userId);

    // 过滤部门权限
    const find = this.sysDepartmentEntity.createQueryBuilder();
    if (this.ctx.admin.username !== 'admin')
      find.andWhere('id in (:ids)', {
        ids: !isEmpty(permsDepartmentArr) ? permsDepartmentArr : [ null ]
      });
    find.addOrderBy('orderNum', 'ASC');
    const departments: SysDepartmentEntity[] = await find.getMany();

    if (!isEmpty(departments)) {
      departments.forEach(e => {
        const parentMenu = departments.filter(m => {
          e.parentId = parseInt(e.parentId + '');
          if (e.parentId == m.id) {
            return m.name;
          }
        });
        if (!isEmpty(parentMenu)) {
          e.parentName = parentMenu[0].name;
        }
      });
    }
    return departments;
  }

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
