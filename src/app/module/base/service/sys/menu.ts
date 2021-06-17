import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@Base/service';
import { isEmpty, remove, uniq } from 'lodash';

/**
 * 菜单
 */
@Provide()
export class SysMenuService extends BaseService {
  /**
   * 根据角色获得权限信息
   * @param {[]} roleIds 数组
   */
  async getPerms(roleIds) {
    let perms = [];
    if (!isEmpty(roleIds)) {
      const result = await this.nativeQuery(
        `SELECT a.perms FROM sys_menu a ${this.setSql(!roleIds.includes('1'),'JOIN sys_role_menu b on a.id = b.menuId AND b.roleId in (?)',[roleIds])}
            where 1=1 and a.perms is not NULL`,
        [ roleIds ]
      );
      if (result) {
        result.forEach(d => {
          if (d.perms) {
            perms = perms.concat(d.perms.split(','));
          }
        });
      }
      perms = uniq(perms);
      perms = remove(perms, n => {
        return !isEmpty(n);
      });
    }
    return uniq(perms);
  }

  /**
   * 获得用户菜单信息
   * @param roleIds
   * @param isAdmin 是否是超管
   */
  async getMenus(roleIds, isAdmin) {
    return await this.nativeQuery(`SELECT a.* FROM sys_menu a ${this.setSql(!isAdmin,'JOIN sys_role_menu b on a.id =b.menuId AND b.roleId in (?)',[roleIds])} GROUP BY a.id ORDER BY orderNum ASC`);
  }

}
