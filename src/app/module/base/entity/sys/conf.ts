import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@Base/entity';
import { Column, Index } from 'typeorm';

/**
 * 系统配置
 */
@EntityModel('sys_conf')
export class SysConfEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '配置键' })
  cKey: string;

  @Column({ comment: '配置值' })
  cValue: string;
}
