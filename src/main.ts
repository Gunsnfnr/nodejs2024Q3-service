import { config } from 'dotenv';
config();
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { Logger } from './services/logger/logger.service';
import { AllExceptionsFilter } from './services/logger/exception-filter/exception-filter';

const port = Number(process.env.PORT) || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: new Logger(),
    bufferLogs: true,
  });
  const logger = new Logger();
  app.useLogger(logger);

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const document = await readFile('doc/api.json', { encoding: 'utf-8' });
  SwaggerModule.setup('doc', app, JSON.parse(document));

  await app.listen(port);

  process.on('uncaughtException', (error: unknown) =>
    logger.error(error as string),
  );
  process.on('unhandledRejection', (error: unknown) => {
    logger.error(error as string);
  });

  // Uncomment to test uncaughtException handling:
  // throw new Error('Test exception');

  // Uncomment to test unhandledRejection handling:
  // process.emit('rejectionHandled', Promise.reject('Test rejection'));
}
bootstrap();
