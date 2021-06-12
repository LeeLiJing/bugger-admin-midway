import { Config, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import ErrorCode from '@Base/utils/error_code';
import { ResOp } from '@Root/interface';
import { nanoid } from 'nanoid';

@Provide()
@Scope(ScopeEnum.Singleton)
export class Utils {
  @Config('jwt')
  jwt;

  /**
   * 根据code获取错误信息
   * @param code {number}
   */
  getErrorMessageByCode(code: number): string {
    return ErrorCode[code];
  }

  res(op?: ResOp): ResOp {
    return {
      data: op?.data ?? null,
      code: op?.code ?? 200,
      message: op?.code ? this.getErrorMessageByCode(op!.code) || op?.message || 'unknown error' : op?.message || 'success'
    };
  }

  /**
   * 生成一个UUID
   */
  generateUUID(): string {
    return nanoid();
  }
}
