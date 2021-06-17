import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@Base/entity';
import { Column, Index } from 'typeorm';


/**
 * 系统用户
 */
@EntityModel('sys_user')
export class SysUserEntity extends BaseEntity {
  @Index()
  @Column({ comment: '部门ID', type: 'bigint', nullable: true })
  departmentId: number;

  @Column({ comment: '姓名', nullable: true })
  name: string;

  @Index({ unique: true })
  @Column({ comment: '用户名', length: 100 })
  username: string;

  @Column({ comment: '密码' })
  password: string;

  @Column({ comment: '密码版本，作用是修改完密码让原来的token失效', default: 1 })
  passwordVersion: number;

  @Column({ comment: '昵称', nullable: true })
  nickName: string;

  @Column({ comment: '头像', nullable: true })
  avatar: string;

  @Index()
  @Column({ comment: '手机号码', nullable: true, length: 20 })
  mobile: string;

  @Column({ comment: '邮箱', nullable: true })
  email: string;

  @Column({ comment: '状态 0:禁用 1：启用', default: 1, type: 'tinyint' })
  status: number;

  @Column({ comment: '备注', nullable: true })
  remark: string;

  // 部门名称
  departmentName: string;

  // 角色ID列表
  roleIdList: number[];
}
