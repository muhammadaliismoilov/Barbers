// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true, // DTOda yo‘q fieldlarni olib tashlaydi
//       forbidNonWhitelisted: true, // qo‘shimcha field kelsa error beradi
//       transform: true,
//     }),
//   );
//   // Swagger config
//   const config = new DocumentBuilder()
//     .setTitle('Barbers API') // API nomi
//     .setDescription('Barbers project API documentation')
//     .setVersion('1.0')
//     .addBearerAuth(
//       {
//         type: 'http',
//         scheme: 'bearer',
//         bearerFormat: 'JWT',
//         name: 'Authorization',
//         description: 'JWT tokenni kiriting: Bearer <token>',
//         in: 'header',
//       },
//       'JWT-auth',
//     )
//     .build();

//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api/docs', app, document, {
//     customCssUrl: '/api/docs/swagger-ui.css',
//     customJs: [
//       '/api/docs/swagger-ui-bundle.js',
//       '/api/docs/swagger-ui-standalone-preset.js',
//       '/api/docs/swagger-ui-init.js',
//     ],
//   });

//   const PORT = process.env.PORT || 4000;
//   await app.listen(PORT, '0.0.0.0', () => {
//     console.log(`🚀 Server is running on http://localhost:${PORT}`);
//     console.log(`📖 Swagger docs: http://localhost:${PORT}/api/docs`);
//   });
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
  
  app.use(cookieParser());
  
  app.set('trust proxy', 1);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTOda yo‘q fieldlarni olib tashlaydi
      forbidNonWhitelisted: true, // qo‘shimcha field kelsa error beradi
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Barbers API') 
    .setDescription('Barbers project API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'JWT tokenni kiriting: Bearer <token>',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customCssUrl: '/api/docs/swagger-ui.css',
    customJs: [
      '/api/docs/swagger-ui-bundle.js',
      '/api/docs/swagger-ui-standalone-preset.js',
      '/api/docs/swagger-ui-init.js',
    ],
  });

  const PORT = process.env.PORT || 4000;
  await app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📖 Swagger docs: http://localhost:${PORT}/api/docs`);
  });
}
bootstrap();

