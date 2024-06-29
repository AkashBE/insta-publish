import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Instagram Image Publisher')
    .setDescription('API to upload images to Instagram')
    .setVersion('1.0')
    .addTag('Instagram')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  app.getHttpAdapter().get('/swagger.json', (req, res) => {
    res.send(document);
  });

  await app.listen(3000);
}
bootstrap();

