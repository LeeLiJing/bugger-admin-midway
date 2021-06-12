import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '@Base/service';
import * as svgCaptcha from 'svg-captcha';
import { AuthCaptchaImageDto } from '@Root/app/module/base/dto/admin/auth';
import { IImageCaptchaResult } from '@Root/app/module/base/service/interface';
import { isEmpty } from 'lodash';
import { Utils } from '@Base/utils';

@Provide()
export class AdminAuthService extends BaseService {
  @Inject()
  utils: Utils;

  /**
   * 验证码
   * @param captcha 图片验证码类型
   */
  async getImgCaptcha(captcha: AuthCaptchaImageDto): Promise<IImageCaptchaResult> {
    const svg = svgCaptcha.create({
      size: 4,
      color: true,
      noise: 4,
      ignoreChars: '0o1i',
      background: '#cc9966',
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
}
