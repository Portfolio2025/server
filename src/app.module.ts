import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HobbyModule } from './hobby/hobby.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SkillModule } from './skill/skill.module';
import { ContactsModule } from './contacts/contacts.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: `/${process.env.API_NAME}/static`,
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
    HobbyModule,
    SkillModule,
    ContactsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
