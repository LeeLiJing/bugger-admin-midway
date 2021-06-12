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
