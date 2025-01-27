import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { UserService } from 'user/user.service';
import { doubleCsrf, DoubleCsrfConfigOptions } from 'csrf-csrf';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);

  const configService = app.get(ConfigService);
  app.setGlobalPrefix(configService.get<string>("API_NAME"))

  const userService = app.get(UserService);
  userService.initUser()

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const doubleCsrfOptions:DoubleCsrfConfigOptions = {
    getSecret: () => configService.get<string>("CSRF_SECRET") || 'default_secret',
    cookieName: 'XSRF-TOKEN', 
    cookieOptions: {
      httpOnly: true,
      secure: configService.get<string>("NODE_ENV ") === 'production',
      sameSite: 'strict',
      path: '/',
    },
    size: 64,
  };
  const {
    invalidCsrfTokenError,
    generateToken,
    validateRequest,
    doubleCsrfProtection,
  } = doubleCsrf(doubleCsrfOptions);
  app.use(doubleCsrfProtection);

  await app.listen(3000);
}
bootstrap();
