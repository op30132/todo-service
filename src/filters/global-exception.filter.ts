import { ExceptionFilter, HttpException, Catch, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { Response } from 'express';
import { SysResponseMsg } from "src/shared/sys-response-msg";
import winston from "winston";
import { Logger } from '../utils/logger';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  logger: winston.Logger = Logger.createLogger(GlobalExceptionFilter.name)

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    this.logger.error(exception.message);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    const error = (exception instanceof Error) ? exception.message : exception.message.error;

    if (exception.status === HttpStatus.NOT_FOUND) {
      status = HttpStatus.NOT_FOUND;
    }

    if (exception.status === HttpStatus.BAD_REQUEST) {
      status = HttpStatus.BAD_REQUEST;
    }

    response.status(status).json({
      error,
      message: (status === HttpStatus.INTERNAL_SERVER_ERROR) ? 'Sorry we are experiencing technical problems.' : exception,
    });
  }
}

