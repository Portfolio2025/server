import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HobbyModule } from './hobby/hobby.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServeStaticModule, ServeStaticModuleOptions } from '@nestjs/serve-static';
import { SkillModule } from './skill/skill.module';
import { ContactsModule } from './contacts/contacts.module';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import * as path from 'path';
import { JwtService } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): ServeStaticModuleOptions[] => [{
        rootPath: join(__dirname, '..', 'public'),
        serveRoot: `/${configService.get<string>("API_NAME")}/static`,
      }],
      inject: [ConfigService]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: "mariadb",
        host: configService.get<string>("DB_HOST"),
        port: configService.get<number>("DB_PORT"),
        username: configService.get<string>("DB_USER"),
        password: configService.get<string>("DB_PASS"),
        database: configService.get<string>("DB_NAME"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: true,
      }),
      inject: [ConfigService]
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('THROTTLE_TTL'),
          limit: config.get('THROTTLE_LIMIT'), 
        },
      ],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule], // подключаем ConfigModule для использования ConfigService
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: configService.get<string>('MAIL_SERVICE'), // получаем значения из конфигурации
          port: configService.get<number>('MAIL_PORT'),
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: `<${configService.get<string>('MAIL_USER')}>`,
        },
        template: {
          dir: path.resolve(__dirname, '../templates'),
          adapter: new EjsAdapter(),
        },
      }),
      inject: [ConfigService], // инжектируем ConfigService
    }),
    HobbyModule,
    SkillModule,
    ContactsModule,
    ProjectsModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
