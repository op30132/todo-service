import { ExceptionFilter, HttpException, Catch, ArgumentsHost, BadRequestException } from "@nestjs/common";
import { Response } from 'express';
import { SysCode } from "src/enum/sys-code.enum";
import { ErrorException } from "src/exceptions/generic-error.exception";
import { SysResponseMsg } from "src/shared/sys-response-msg";
import winston from "winston";
import { Logger } from '../utils/logger';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  logger: winston.Logger = Logger.createLogger(GlobalExceptionFilter.name)

  catch(error: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let msg: SysResponseMsg | string;
    if (error instanceof ErrorException) {
      // 查詢 db 發生錯誤
      this.logger.error(error.message);
      msg = new SysResponseMsg(error.errCode, error.message);
    } else if (error instanceof BadRequestException) {
      this.logger.error(error)
      this.logger.error(error.stack)
      msg = new SysResponseMsg(SysCode.BAD_REQUEST, 'BAD REQUEST');
    } else if (error instanceof HttpException) {
      if (error.getStatus() === 404) {
        msg = new SysResponseMsg(SysCode.PATH_NOT_FOUND, '非合法路徑')
      } else {
        this.logger.error(error)
        this.logger.error(error.stack)
      }
    } else {
      this.logger.error(error)
      this.logger.error(error.stack)
      msg = new SysResponseMsg(SysCode.UNKNOWN_ERROR, error.message);
    }
    response.status(200).json(msg);
  }
}

