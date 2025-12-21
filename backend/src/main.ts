import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://casadoporco.com.br', 'https://admin.casadoporco.com.br'] // Altere para seus domínios
      : [
          'http://localhost:5173', 
          'http://localhost:5174', 
          'http://localhost:5175', 
          'http://localhost:3000', 
          'http://127.0.0.1:5173',
          'http://127.0.0.1:5174',
          'http://127.0.0.1:5175',
        ],
    credentials: true,
  });

  // Prefixo global da API
  app.setGlobalPrefix('api');

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Casa do Porco API')
    .setDescription('API para gestão de cardápio e reservas do restaurante Casa do Porco')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Autenticação e autorização')
    .addTag('users', 'Gestão de usuários')
    .addTag('menu', 'Gestão do cardápio')
    .addTag('bookings', 'Gestão de reservas')
    .addTag('blocked-slots', 'Gestão de horários bloqueados')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Casa do Porco API running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();

