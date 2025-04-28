import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Set up global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Mlaku-Mulu Travel Agency API')
    .setDescription('API for managing tourists and their travels')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
