import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '@Base/service';
import { SysMenuService } from '@Root/app/module/base/service/sys/menu';

@Provide()
export class SysPermsService extends BaseService {
  @Inject()
  sysMenuService: SysMenuService;

  /**
   * 获得权限菜单
   * @param roleIds
   */
  async permmenu(roleIds: number[]) {
    const perms = await this.sysMenuService.getPerms(roleIds);
    const menus = await this.sysMenuService.getMenus(roleIds, this.ctx.admin.username === 'admin');
    return { perms, menus };
  }

  /**
   * 根据用户ID获得部门权限
   * @param userId
   * @return 部门ID数组
   */
  async departmentIds(userId: number) {
    const getCacheClient = await this.getCache();
    const department = await getCacheClient.get(`admin:department:${userId}`);

    if (department) {
      return JSON.parse(department);
    } else {
      return [];
    }
  }
}
