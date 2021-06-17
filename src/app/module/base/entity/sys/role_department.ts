import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@Base/entity';
import { Column } from 'typeorm';

@EntityModel('sys_role_department')
export class SysRoleDepartmentEntity extends BaseEntity {
  @Column({ comment: '角色ID', type: 'bigint' })
  roleId: number;

  @Column({ comment: '部门ID', type: 'bigint' })
  departmentId: number;
}
