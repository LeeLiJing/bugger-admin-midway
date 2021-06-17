import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 模型基类
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @CreateDateColumn({ comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: Date;
}
