import { Module } from '@nestjs/common';
import { HobbyService } from './hobby.service';
import { HobbyController } from './hobby.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hobby, Section, Content, TextBlock, Picture } from './entities/hobby.entity';

@Module({
  controllers: [HobbyController],
  providers: [HobbyService],
  imports: [
    TypeOrmModule.forFeature([
      Hobby,
      Section,
      Content,
      TextBlock,
      Picture,
    ])
  ]
})
export class HobbyModule { }
