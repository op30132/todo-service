import { ExceptionFilter, HttpException, Catch, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { Response } from 'express';
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
    if (error instanceof HttpException) {
      this.logger.error(error.message);
      msg = new SysResponseMsg(error.getStatus(), HttpStatus[error.getStatus()])
    } else {
      this.logger.error(error.message);
      msg = new SysResponseMsg(500, 'unknown error')
    }
    response.status(200).json(msg);
  }
}

