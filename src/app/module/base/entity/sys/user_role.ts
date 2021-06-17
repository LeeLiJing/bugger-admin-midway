import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@Base/entity';
import { Column } from 'typeorm';

/**
 * 用户角色
 */
@EntityModel('sys_user_role')
export class SysUserRoleEntity extends BaseEntity {
  @Column({ comment: '用户ID', type: 'bigint' })
  userId: number;

  @Column({ comment: '角色ID', type: 'bigint' })
  roleId: number;
}
