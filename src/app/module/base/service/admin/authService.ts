import { Config, Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '@Base/service';
import { InjectEntityModel } from '@midwayjs/orm';
import { isEmpty } from 'lodash';
import { Utils } from '@Base/utils';
import { Repository } from 'typeorm';
import * as md5 from 'md5';
import * as svgCaptcha from 'svg-captcha';
import * as jwt from 'jsonwebtoken';
import { AuthCaptchaImageDto, AuthLoginDto } from '@Root/app/module/base/dto/admin/auth';
import { IImageCaptchaResult } from '@Root/app/module/base/service/interface';
import { CommonException } from '@Root/app/module/base/exception/common';
import { SysUserEntity } from '@Root/app/module/base/entity/sys/user';
import { SysRoleService } from '@Root/app/module/base/service/sys/role';
import { ICoreConfig } from '@Root/interface';
import { SysMenuService } from '@Root/app/module/base/service/sys/menu';
import { SysDepartmentService } from '@Root/app/module/base/service/sys/department';

@Provide()
export class AdminAuthService extends BaseService {
  @Inject()
  utils: Utils;

  @InjectEntityModel(SysUserEntity)
  sysUserEntity: Repository<SysUserEntity>;

  @Inject()
  sysRoleService: SysRoleService;

  @Inject()
  sysMenuService: SysMenuService;

  @Inject()
  sysRoleDepartmentService: SysDepartmentService;

  @Config('CoreConfig')
  coreConfig: ICoreConfig;


  /**
   * 验证码
   * @param captcha 图片验证码类型
   */
  async getImgCaptcha(captcha: AuthCaptchaImageDto): Promise<IImageCaptchaResult> {
    const svg = svgCaptcha.create({
      size: 4,
      noise: 1,
      color: true,
      ignoreChars: '0o1i',
      width: isEmpty(captcha.width) ? 100 : captcha.width,
      height: isEmpty(captcha.height) ? 50 : captcha.height
    });
    const result = {
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString('base64')}`,
      id: this.utils.generateUUID()
    };

    const getCacheClient = await this.getCache();
    await getCacheClient.set(`verify:captcha:img:${result.id}`, svg.text, 'EX', 60 * 10);
    return result;
  }

  /**
   * 检验图片验证码
   * @param captchaId 验证码ID
   * @param value 验证码
   */
  async captchaCheck(captchaId: string, value: string): Promise<boolean> {
    const getCacheClient = await this.getCache();
    const rv = await getCacheClient.get(`verify:captcha:img:${captchaId}`);
    if (!rv || !value || value.toLowerCase() !== rv!.toLowerCase()) {
      return false;
    } else {
      // 校验成功后移除验证码
      await getCacheClient.del(`verify:captcha:img:${captchaId}`);
      return true;
    }
  }

  /**
   * 登录
   * @param params
   */
  async login(params: AuthLoginDto) {
    const { username, captchaId, verifyCode, password } = params;

    // 校验验证码
    const isCheck = await this.captchaCheck(captchaId, verifyCode);
    if (isCheck) {
      const user = await this.sysUserEntity.findOne({ username });
      // 校验用户
      if (user) {
        // 校验用户状态及密码
        if (user.status === 0 || user.password !== md5(password)) {
          throw new CommonException(10003);
        }
      } else {
        throw new CommonException(10003);
      }

      // 校验角色
      const roleIds = await this.sysRoleService.getByUser(user.id);
      if (isEmpty(roleIds)) {
        throw new CommonException(10017);
      }

      // 生成token
      const { expire, refreshExpire } = this.coreConfig.jwt.token;
      const result = {
        expire,
        token: await this.generateToken(user, roleIds, expire),
        refreshExpire,
        refreshToken: await this.generateToken(user, roleIds, refreshExpire, true)
      };

      // 将用户相关信息保存到缓存
      const getCacheClient = await this.getCache();
      const perms = await this.sysMenuService.getPerms(roleIds);
      const departments = await this.sysRoleDepartmentService.getByRoleIds(roleIds, user.username === 'admin');

      await getCacheClient.set(`admin:department:${user.id}`, JSON.stringify(departments));
      await getCacheClient.set(`admin:perm:${user.id}`, JSON.stringify(perms));
      await getCacheClient.set(`admin:token:${user.id}`, result.token);
      await getCacheClient.set(`admin:token:refresh:${user.id}`, result.token);
      return result;
    } else {
      throw new CommonException(10002);
    }
  }

  /**
   * 生成token
   * @param user 用户对象
   * @param roleIds 角色集合
   * @param expire 过期
   * @param isRefresh 是否是刷新
   */
  async generateToken(user, roleIds, expire, isRefresh?) {
    const getCacheClient = await this.getCache();
    await getCacheClient.set(`admin:passwordVersion:img:${user.id}`, user.passwordVersion);
    const tokenInfo = {
      isRefresh: false,
      roleIds,
      username: user.username,
      userId: user.id,
      passwordVersion: user.passwordVersion
    };

    if (isRefresh) {
      tokenInfo.isRefresh = true;
    }

    return jwt.sign(tokenInfo, this.coreConfig.jwt.secret, { expiresIn: expire });
  }

  /**
   * 刷新token
   * @param token
   */
  async refreshToken(token: string) {
    const getCacheClient = await this.getCache();

    try {
      const decoded = jwt.verify(token, this.coreConfig.jwt.secret);
      if (decoded && decoded['isRefresh']) {
        delete decoded['exp'];
        delete decoded['iat'];

        const { expire, refreshExpire } = this.coreConfig.jwt.token;
        decoded['isRefresh'] = false;
        const result = {
          expire,
          token: jwt.sign(decoded, this.coreConfig.jwt.secret, { expiresIn: expire }),
          refreshExpire,
          refreshToken: ''
        };
        decoded['isRefresh'] = true;
        result.refreshToken = jwt.sign(decoded, this.coreConfig.jwt.secret, { expiresIn: refreshExpire });
        await getCacheClient.set(`admin:passwordVersion:${decoded['userId']}`, decoded['passwordVersion']);
        return result;
      }
    } catch (err) {
      throw new CommonException(401);
      return;
    }
  }
}
