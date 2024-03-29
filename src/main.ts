import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });

  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('English Learning API')
    .setDescription('The English Learning API using NestJS and Prisma ORM')
    .setVersion('1.0')
    .addTag('english-learning')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: true,
  });

  await app.listen(port, '0.0.0.0');
}
bootstrap();
