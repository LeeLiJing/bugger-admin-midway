import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@Base/entity';
import { Column } from 'typeorm';

@EntityModel('sys_role_menu')
export class SysRoleMenuEntity extends BaseEntity {
  @Column({ comment: '角色ID', type: 'bigint' })
  roleId: number;

  @Column({ comment: '菜单ID', type: 'bigint' })
  menuId: number;
}
