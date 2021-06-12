import { Inject } from '@midwayjs/decorator';
import { Context } from 'egg';
import { Utils } from '@Base/utils';
import { ResOp } from '@Root/interface';

// 控制类基类
export class BaseController {
  @Inject()
  ctx: Context;

  @Inject()
  utils: Utils;

  /**
   * 成功返回
   * @param op
   * */

  ok(op?: ResOp): ResOp {
    return {
      data: op?.data ?? null,
      code: op?.code ?? 200,
      message: op?.code ? this.utils.getErrorMessageByCode(op!.code) || op?.message || 'unknown error' : op?.message || 'success'
    };
  }
}
