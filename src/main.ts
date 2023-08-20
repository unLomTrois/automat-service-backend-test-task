import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  const swagger_config = new DocumentBuilder()
    .setTitle('TEST TASK API')
    .setDescription('Документация по API')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, swagger_config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
    },
  });

  const configService = app.get<ConfigService>(ConfigService);
  const PORT = configService.get<number>('API_PORT');

  await app.listen(PORT).then(() => {
    console.info(`Server started on port http://localhost:${PORT}/api`);
  });
}
bootstrap();
