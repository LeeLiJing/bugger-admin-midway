import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@Base/entity';
import { Column, Index } from 'typeorm';

/**
 * 系统日志
 * */
@EntityModel('sys_log')
export class SysLogEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID', nullable: true, type: 'bigint' })
  userId: number;

  @Index()
  @Column({ comment: '行为', length: 100 })
  action: string;

  @Index()
  @Column({ comment: 'ip', nullable: true, length: 50 })
  ip: string;

  @Index()
  @Column({ comment: 'ip地址', nullable: true, length: 50 })
  ipAddr: string;

  @Column({ comment: '参数', nullable: true, type: 'text' })
  params: string;
}
