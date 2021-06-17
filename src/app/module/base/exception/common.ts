import { BaseException } from '@Base/exception';
import errorCode from '@Base/utils/error_code';

/**
 * 通用异常
 */
export class CommonException extends BaseException {
  constructor(code: number) {
    super('CommException', code, errorCode[code]);
  }
}
