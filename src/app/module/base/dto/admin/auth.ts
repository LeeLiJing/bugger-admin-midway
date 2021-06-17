import { Rule, RuleType } from '@midwayjs/decorator';
import { Expose } from 'class-transformer';

export class AuthCaptchaImageDto {
  @Rule(RuleType.number().integer())
  @Expose()
  width: number;

  @Rule(RuleType.number().integer())
  @Expose()
  height: number;
}

export class AuthLoginDto {
  // 用户名
  @Rule(RuleType.string().required())
  @Expose()
  username: string;

  // 密码
  @Rule(RuleType.string().required())
  @Expose()
  password: string;

  // 验证码
  @Rule(RuleType.string().required())
  @Expose()
  verifyCode: string;

  //验证码ID
  @Rule(RuleType.string().required())
  @Expose()
  captchaId: string;
}
