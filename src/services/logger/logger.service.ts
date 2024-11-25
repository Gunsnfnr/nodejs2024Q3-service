import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

@Injectable()
export class Logger extends ConsoleLogger implements LoggerService {
  private logLevel = Number(process.env.LOGGING_LEVEL);

  async writeToFile(msg: string) {
    const writeStream = createWriteStream('./logs/logger.txt', {
      flags: 'a+',
      encoding: 'utf-8',
    });
    const timestamp = new Date().toISOString();
    const formattedMessage = `${timestamp} ${msg} \n`;
    await pipeline(formattedMessage, writeStream);
  }

  async log(message: string) {
    if (this.logLevel <= 1) {
      await this.writeToFile(message);
    }
  }

  async warn(message: string) {
    if (this.logLevel <= 2) {
      await this.writeToFile(message);
    }
  }

  async error(message: string) {
    if (this.logLevel <= 3) {
      await this.writeToFile(message);
    }
  }

  async fatal(message: string) {
    if (this.logLevel <= 4) {
      await this.writeToFile(message);
    }
  }

  async debug(message: string) {
    if (this.logLevel === 0) {
      await this.writeToFile(message);
    }
  }

  async verbose(message: string) {
    if (this.logLevel === 0) {
      await this.writeToFile(message);
    }
  }
}
