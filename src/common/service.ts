import { Inject } from '@midwayjs/decorator';
import { CacheManager } from '@midwayjs/cache';
import { Redis } from 'ioredis';
import { isEmpty } from 'lodash';
import { getManager, EntityManager } from 'typeorm';


export abstract class BaseService {
  @Inject('cache:cacheManager')
  cacheManager: CacheManager;

  protected sqlParams: any;


  getCache(): Promise<Redis> {
    return (this.cacheManager.cache.store as any).getClient();
  }

  /**
   * 获得ORM管理
   *  @param connectionName 连接名称
   */
  getManager(connectionName): EntityManager {
    return getManager(connectionName);
  }

  /**
   * 原生查询
   * @param sql
   * @param params
   * @param connectionName
   */
  async nativeQuery(sql: any, params?: any, connectionName?: any) {
    if (isEmpty(params)) {
      params = this.sqlParams;
    }

    let newParams = [];
    newParams = newParams.concat(params);
    this.sqlParams = [];
    return await this.getManager(connectionName).query(sql, newParams || []);
  }

  /**
   * 设置sql
   * @param condition 条件是否成立
   * @param sql sql语句
   * @param params 参数
   */
  setSql(condition: any, sql: any, params: any) {
    let rSql = false;
    if (condition || (condition === 0 && condition !== '')) {
      rSql = true;
      this.sqlParams = this.sqlParams.concat(params);
    }
    return rSql ? sql : '';
  }

}
