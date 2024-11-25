import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';

const LOG_DIR = './logs';

@Injectable()
export class Logger extends ConsoleLogger implements LoggerService {
  private logLevel = Number(process.env.LOGGING_LEVEL);
  private logFileSize = Number(process.env.MAX_FILE_SIZE);

  async writeToFile(msg: string, baseFileName: 'logs' | 'errors') {
    const pathToFile = join(LOG_DIR, `${baseFileName}.log`);
    const writeStream = createWriteStream(pathToFile, {
      flags: 'a+',
      encoding: 'utf-8',
    });
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const formattedMessage = `${timestamp} ${msg} \n`;
    await pipeline(formattedMessage, writeStream);
  }

  async log(message: string) {
    if (this.logLevel <= 1) {
      await this.writeToFile(message, 'logs');
    }
  }

  async warn(message: string) {
    if (this.logLevel <= 2) {
      await this.writeToFile(message, 'logs');
    }
  }

  async error(message: string) {
    if (this.logLevel <= 3) {
      await this.writeToFile(message, 'errors');
    }
  }

  async fatal(message: string) {
    if (this.logLevel <= 4) {
      await this.writeToFile(message, 'errors');
    }
  }

  async debug(message: string) {
    if (this.logLevel === 0) {
      await this.writeToFile(message, 'logs');
    }
  }

  async verbose(message: string) {
    if (this.logLevel === 0) {
      await this.writeToFile(message, 'logs');
    }
  }
}
