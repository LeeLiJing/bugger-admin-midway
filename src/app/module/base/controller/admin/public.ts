import { ALL, Body, Controller, Get, Inject, Post, Provide, Query } from '@midwayjs/decorator';
import { BaseController } from '@Base/controller';
import { ResOp } from '@Root/interface';
import { AdminAuthService } from '@Root/app/module/base/service/admin/authService';
import { AuthCaptchaImageDto, AuthLoginDto } from '@Root/app/module/base/dto/admin/auth';

@Provide()
@Controller('/admin/public')
export class AdminPublicController extends BaseController {
  @Inject()
  authService: AdminAuthService;

  /**
   * 获取验证码
   * */

  @Get('/captcha')
  async getCaptcha(@Query(ALL) captcha: AuthCaptchaImageDto): Promise<ResOp> {
    return this.ok({
      data: await this.authService.getImgCaptcha(captcha)
    });
  }

  /**
   * 登录
   * @param params
   */
  @Post('/login')
  async login(@Body(ALL) params: AuthLoginDto): Promise<ResOp> {
    return this.ok({
      data: await this.authService.login(params)
    });
  }

  /**
   * 刷新token
   * */
  @Get('refreshToken')
  async refreshToken(@Query() refreshToken: string): Promise<ResOp> {
    return this.ok({
      data: await this.authService.refreshToken(refreshToken)
    });
  }

}
