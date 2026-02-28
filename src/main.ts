import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors();

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('CalorieWise API')
    .setDescription('CalorieWise backend — Users, Fitness, Analytics & AI Exercise Plan')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Exercise')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 10000;

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on port ${port}`);
  console.log(`📖 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();