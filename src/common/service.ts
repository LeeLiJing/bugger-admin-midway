import { Inject } from '@midwayjs/decorator';
import { CacheManager } from '@midwayjs/cache';
import { Redis } from 'ioredis';

export class BaseService {
  @Inject('cache:cacheManager')
  cacheManager: CacheManager;

  getCache(): Promise<Redis> {
    return (this.cacheManager.cache.store as any).getClient();
  }
}
