import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';

const port = Number(process.env.PORT) || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = await readFile('doc/api.json', { encoding: 'utf-8' });
  SwaggerModule.setup('doc', app, JSON.parse(document));

  await app.listen(port);
}
bootstrap();
