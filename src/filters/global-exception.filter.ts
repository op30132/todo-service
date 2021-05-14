import { ExceptionFilter, HttpException, Catch, ArgumentsHost, HttpStatus } from "@nestjs/common";
import winston from "winston";
import { Logger } from '../utils/logger';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  logger: winston.Logger = Logger.createLogger(GlobalExceptionFilter.name)

  catch(error: any, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    if (error.getStatus() === HttpStatus.UNAUTHORIZED) {
      if (typeof error.response !== 'string') {
        error.response.message =
          error.response.message ||
          'You do not have permission to access this resource';
      }
    }

    res.status(error.getStatus()).json({
      statusCode: error.getStatus(),
      error: error.response.name || error.response.error || error.name,
      message: error.response.message || error.response || error.message,
      timestamp: new Date().toISOString(),
      path: req ? req.url : null,
    });
  }
}

