import winston = require('winston');
import * as DailyRotateFile from "winston-daily-rotate-file";
import { DateUtils } from './date-utils';

export class Logger {
  static createLogger(className: string, path = './logs', fileName = 'stdout'): winston.Logger {
    const { format } = winston
    const { combine, timestamp, label, printf } = format;

    const logFormat = printf(({ level, message, label, timestamp }) => {
      if (typeof message === 'object') {
        message = JSON.stringify(message)
      }
      return `${DateUtils.formatDate(new Date(timestamp))} [${label}] ${level}: ${message}`;
    });

    const logger = winston.createLogger({
      transports: [

        new DailyRotateFile({
          level: 'info',
          filename: `${path}/${fileName}-%DATE%.log`,
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: '50m',
          maxFiles: '14d'
        })
      ],
      format: combine(
        label({ label: className }),
        timestamp(),
        logFormat
      )
    });
    if (process.env.PROD && !JSON.parse(process.env.PROD)) {
      logger.add(new winston.transports.Console())
    }
    return logger;
  }

}