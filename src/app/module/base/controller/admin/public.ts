import { ALL, Controller, Get, Inject, Provide, Query } from '@midwayjs/decorator';
import { BaseController } from '@Base/controller';
import { ResOp } from '@Root/interface';
import { AdminAuthService } from '@Root/app/module/base/service/admin/authService';
import { AuthCaptchaImageDto } from '@Root/app/module/base/dto/admin/auth';

@Provide()
@Controller('/public')
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
}
