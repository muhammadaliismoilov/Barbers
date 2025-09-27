import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTOda yo‘q fieldlarni olib tashlaydi
      forbidNonWhitelisted: true, // qo‘shimcha field kelsa error beradi
      transform: true,
    }),
  );
  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Barbers API') // API nomi
    .setDescription('Barbers project API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = process.env.PORT || 4000;
  await app.listen(PORT,'0.0.0.0', () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📖 Swagger docs: http://localhost:${PORT}/api/docs`);
  });
}
bootstrap();
