import { Logger } from '../utils/logger';
import { Injectable } from "@nestjs/common";
import winston from 'winston';

@Injectable()
export class LogService {

  logger: winston.Logger = LogService.getLog(LogService.name);

  constructor() { }

  static getLog(className: string): winston.Logger {
    return Logger.createLogger(className, './logs/todo', 'todo')
  }

}